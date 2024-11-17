// src/controllers/UserController.ts
import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';
import { USER_TYPES } from '../../types';
import { prisma } from '../lib/prisma';

export class UserController {
  public static readonly uploadAvatar: RequestHandler = async (req, res) => {
    const { id } = req.params;

    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      if (req.file && (req.file as any).location) {
        await prisma.user.update({
          where: { id },
          data: {
            avatar: (req.file as any).location,
          },
        });

        res.status(200).json({
          message: 'Avatar uploaded successfully',
          avatarUrl: (req.file as any).location,
        });
      } else {
        res.status(400).json({ message: 'No file uploaded' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public static readonly deleteUser: RequestHandler = async (req, res) => {
    const { id } = req.params;

    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user || user.isDeleted) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      await prisma.user.update({
        where: { id },
        data: { isDeleted: true },
      });

      res.status(200).json({ message: 'User has been soft deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // src/controllers/UserController.ts (continuação)

  public static readonly createProfessional: RequestHandler = async (
    req,
    res
  ) => {
    try {
      const {
        name,
        email,
        password,
        phoneNumber,
        avatar,
        description,
        gender,
        location,
        specialty,
        experience,
        rating,
        price,
        reviews,
        available,
        isPremium,
        validated,
        address,
        certifications,
        contacts,
        social,
        services,
        schedule,
        reviewsList,
      } = req.body;

      // Verifica se o email ou número de telefone já existem
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { phoneNumber }],
        },
      });

      if (existingUser?.email === email) {
        res.status(400).json({ message: 'Email already in use' });
        return;
      }

      if (existingUser?.phoneNumber === phoneNumber) {
        res.status(400).json({ message: 'Phone number already in use' });
        return;
      }

      // Criptografa a senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Cria o usuário com o perfil profissional em uma única transação
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phoneNumber,
          avatar,
          description,
          gender,
          userType: USER_TYPES.PROFESSIONAL,
          professionalProfile: {
            create: {
              location,
              specialty,
              experience,
              rating: rating || 0,
              price,
              reviews: reviews || 0,
              available,
              isPremium,
              validated,
              address,
              certifications,
              contacts,
              social,
              services,
              schedule,
              reviewsList,
            },
          },
        },
        include: {
          professionalProfile: true,
        },
      });

      res.status(201).json({
        message: 'Professional user created successfully',
        user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  public static readonly createBackofficeUser: RequestHandler = async (
    req,
    res
  ) => {
    try {
      const {
        name,
        email,
        password,
        phoneNumber,
        avatar,
        description,
        gender,
      } = req.body;

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { phoneNumber }],
        },
      });

      if (existingUser?.email === email) {
        res.status(400).json({ message: 'Email already in use' });
        return;
      }

      if (existingUser?.phoneNumber === phoneNumber) {
        res.status(400).json({ message: 'Phone number already in use' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phoneNumber,
          avatar,
          description,
          gender,
          userType: USER_TYPES.BACKOFFICE,
        },
      });

      res.status(201).json({
        message: 'Backoffice user created successfully',
        user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  public static readonly completeProfile: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        location,
        specialty,
        experience,
        rating,
        price,
        reviews,
        available,
        isPremium,
        validated,
        address,
        certifications,
        contacts,
        social,
        services,
        schedule,
        reviewsList,
      } = req.body;

      const user = await prisma.user.findUnique({
        where: { id },
        include: { professionalProfile: true },
      });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          userType: USER_TYPES.PROFESSIONAL,
          professionalProfile: {
            upsert: {
              create: {
                location,
                specialty,
                experience,
                rating: rating || 0,
                price,
                reviews: reviews || 0,
                available,
                isPremium,
                validated,
                address,
                certifications,
                contacts,
                social,
                services,
                schedule,
                reviewsList,
              },
              update: {
                location,
                specialty,
                experience,
                rating: rating || 0,
                price,
                reviews: reviews || 0,
                available,
                isPremium,
                validated,
                address,
                certifications,
                contacts,
                social,
                services,
                schedule,
                reviewsList,
              },
            },
          },
        },
        include: {
          professionalProfile: true,
        },
      });

      res.status(200).json({
        message: 'Profile completed successfully',
        user: updatedUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  public static readonly getUserById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id },
        include: { professionalProfile: true },
      });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  public static readonly getAllUsers: RequestHandler = async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        where: { isDeleted: false },
        include: { professionalProfile: true },
      });

      res.status(200).json({ users });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  public static readonly getAllBackofficeUsers: RequestHandler = async (
    req,
    res
  ) => {
    try {
      const users = await prisma.user.findMany({
        where: {
          userType: USER_TYPES.BACKOFFICE,
          isDeleted: false,
        },
      });

      res.status(200).json({ users });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
}
