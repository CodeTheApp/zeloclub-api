// src/controllers/UserController.ts
import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import { USER_TYPES } from "../../types";
import { prisma } from "../lib/prisma";
import { sendPasswordResetEmail } from "../services/emailService";
import { faker } from "@faker-js/faker";
import { isUUID } from "validator";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import path from "path";
import { completeProfileSchema, createBackofficeUserSchema, createProfessionalSchema } from "../schemas/ProfessionalProfile";
import { getAllBackofficeUsersSchema, getAllUsersSchema, getUserByIdSchema } from "../schemas/User";

export class UserController {
  public static readonly uploadAvatar: RequestHandler = async (
    req: AuthenticatedRequest,
    res
  ) => {
    const formatAvatarFilename = (
      userId: string,
      file: Express.Multer.File
    ): string => {
      const timestamp = Date.now();
      const extension = path.extname(file.originalname).toLowerCase();
      return `avatar_${userId}_${timestamp}${extension}`;
    };
    const { id } = req.params;
    const requestUser = req.user;

    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if (requestUser?.userType !== "Backoffice" && requestUser?.id !== id) {
        res
          .status(403)
          .json({
            message: "Access denied. You can only update your own avatar.",
          });
        return;
      }
      if (req.file) {
        const newAvatarFilename = formatAvatarFilename(id, req.file);
        const updatedUser = await prisma.user.update({
          where: { id },
          data: {
            avatar: newAvatarFilename,
            updatedAt: new Date(),
          },
        });
        res.status(200).json({
          message: "Avatar uploaded successfully",
          avatarUrl: newAvatarFilename,
        });
      } else {
        res.status(400).json({ message: "No file uploaded" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  public static readonly deleteUser: RequestHandler = async (req, res) => {
    const { id } = req.params;
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          Service: true,
          Application: true,
          ProfessionalProfile: true,
        },
      });
      if (!user || user.isDeleted) {
        res.status(404).json({ message: "User not found or already deleted" });
        return;
      }
      const updateServices = prisma.service.updateMany({
        where: { User: { id: id } },
        data: { isDeleted: true },
      });
      const updateApplications = prisma.application.updateMany({
        where: { User: { id: id } },
        data: { isDeleted: true },
      });
      const updateUser = prisma.user.update({
        where: { id },
        data: {
          isDeleted: true,
          updatedAt: new Date(),
        },
      });
      await Promise.all([updateServices, updateApplications, updateUser]);
      res
        .status(200)
        .json({
          message:
            "User and associated services/applications have been soft deleted",
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // src/controllers/UserController.ts (continuação)

  public static readonly createProfessional: RequestHandler = async (
    req,
    res
  ) => {
    try {

      const result = createProfessionalSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({ message: "Validation failed", errors: result.error.errors });
        return;
      }
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
        isCompleted,
        isValidated,
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
        res.status(400).json({ message: "Email already in use" });
        return;
      }

      if (existingUser?.phoneNumber === phoneNumber) {
        res.status(400).json({ message: "Phone number already in use" });
        return;
      }

      // Criptografa a senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Cria o usuário com o perfil profissional em uma única transação
      const user = await prisma.user.create({
        data: {
          updatedAt: new Date(),
          name,
          email,
          password: hashedPassword,
          phoneNumber,
          avatar,
          description,
          gender,
          userType: USER_TYPES.PROFESSIONAL,
          ProfessionalProfile: {
            create: {
              location,
              specialty,
              experience,
              rating: rating || 0,
              price,
              reviews: reviews || 0,
              available,
              isCompleted,
              isValidated,
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
          ProfessionalProfile: true,
        },
      });

      res.status(201).json({
        message: "Professional user created successfully",
        user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  public static readonly createBackofficeUser: RequestHandler = async (
    req,
    res
  ) => {
    try {
      const result = createBackofficeUserSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({ message: "Validation failed", errors: result.error.errors });
        return;
      }
      const { name, email, phoneNumber, avatar, description, gender } =
        req.body;

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { phoneNumber }],
        },
      });

      if (existingUser?.email === email) {
        res.status(400).json({ message: "Email already in use" });
        return;
      }

      if (existingUser?.phoneNumber === phoneNumber) {
        res.status(400).json({ message: "Phone number already in use" });
        return;
      }

      const temporaryPassword = faker.internet.password({
        length: 6,
        memorable: true,
        pattern: /[A-NP-Z1-9]/,
      }); // '1-9 a-z retirando "O" e "0" pq sao parecidos'
      const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

      const user = await prisma.user.create({
        data: {
          updatedAt: new Date(),
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

      const token =
        faker.string.alphanumeric(6) + "-" + faker.string.alphanumeric(6);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: token,
          resetPasswordExpires: new Date(Date.now() + 3600000), // 1 hora
        },
      });

      await sendPasswordResetEmail(email, token);
      console.log(token);

      res.status(201).json({
        message:
          "Backoffice user created successfully. A password reset email has been sent.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          userType: user.userType,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  public static readonly completeProfile: RequestHandler = async (
    req: AuthenticatedRequest,
    res
  ) => {
    try {
      const { id } = req.params;
      const requestUser = req.user;
      
      const result = completeProfileSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({ message: "Validation failed", errors: result.error.errors });
        return;
      }

      const {
        location,
        specialty,
        experience,
        rating,
        price,
        reviews,
        available,
        isCompleted,
        isValidated,
        address,
        certifications,
        contacts,
        social,
        services,
        schedule,
        reviewsList,
      } = req.body;

      if (
        requestUser?.userType !== USER_TYPES.BACKOFFICE &&
        requestUser?.id !== id
      ) {
        res
          .status(403)
          .json({
            message: "Access denied. You can only update your own profile.",
          });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id },
        include: { ProfessionalProfile: true },
      });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      if (user.userType === USER_TYPES.PROFESSIONAL) {
        if (!location || !specialty || !price || !available) {
          res.status(400).json({
            message:
              "Missing required fields for Professional user: location, specialty, price, available.",
          });
          return;
        }
      }
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          updatedAt: new Date(),
          userType: USER_TYPES.PROFESSIONAL,
          ProfessionalProfile: {
            upsert: {
              create: {
                location,
                specialty,
                experience,
                rating: rating || 0,
                price,
                reviews: reviews || 0,
                available,
                isCompleted,
                isValidated,
                address: address || {},
                certifications: certifications || [],
                contacts: contacts || {},
                social: social || {},
                services: services || [],
                schedule: schedule || [],
                reviewsList: reviewsList || [],
              },
              update: {
                location,
                specialty,
                experience,
                rating: rating || 0,
                price,
                reviews: reviews || 0,
                available,
                isCompleted:true,
                isValidated,
                address: address || {},
                certifications: certifications || [],
                contacts: contacts || {},
                social: social || {},
                services: services || [],
                schedule: schedule || [],
                reviewsList: reviewsList || [],
              },
            },
          },
        },
        include: {
          ProfessionalProfile: true,
        },
      });

      res.status(200).json({
        message: "Profile completed successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  public static readonly getUserById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;

      const result = getUserByIdSchema.safeParse({ id });
      if (!result.success) {
        res.status(400).json({ message: result.error.errors[0].message });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id, isDeleted: false },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          description: true,
          userType: true,
          phoneNumber: true,
          gender: true,
          ProfessionalProfile: true,
        },
      });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  //GET /users?page=1&pageSize=5&sortBy=name&sortOrder=desc&userType=Admin&gender=Male
  public static readonly getAllUsers: RequestHandler = async (
    req: AuthenticatedRequest,
    res
  ) => {
    try {
      const result = getAllUsersSchema.safeParse(req.query);
      if (!result.success) {
        res.status(400).json({ message: result.error.errors[0].message });
        return;
      }
      const {
        page = 1,
        pageSize = 10,
        sortBy = "createdAt",
        sortOrder = "asc",
        ...filters
      } = req.query;

      const pageNumber = Number(page);
      const pageSizeNumber = Number(pageSize);
      const skip = (pageNumber - 1) * pageSizeNumber;
      const requestUser = req.user;
      const isBackofficeUser = requestUser?.userType === USER_TYPES.BACKOFFICE;
      const whereConditions: any = {
        ...filters,
      };
      if (!isBackofficeUser) {
        whereConditions.isDeleted = false;
      }
      const orderBy: Record<string, "asc" | "desc"> = {};
      if (typeof sortBy === "string") {
        orderBy[sortBy] =
          sortOrder === "asc" || sortOrder === "desc" ? sortOrder : "asc";
      }

      const users = await prisma.user.findMany({
        where: whereConditions,
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          description: true,
          userType: true,
          phoneNumber: true,
          isDeleted: true,
          gender: true,
          ProfessionalProfile: true,
        },
        skip,
        take: pageSizeNumber,
        orderBy,
      });

      res.status(200).json({ users });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  //GET /backoffice-users?name=Jane&email=@example.com&gender=Female&page=1&limit=10
  public static readonly getAllBackofficeUsers: RequestHandler = async (
    req,
    res
  ) => {
    try {
      const result = getAllBackofficeUsersSchema.safeParse(req.query);
      if (!result.success) {
        res.status(400).json({ message: result.error.errors[0].message });
        return;
      }
      const { name, email, gender, page = 1, limit = 10 } = req.query;

      const filters: any = {
        userType: USER_TYPES.BACKOFFICE,
        isDeleted: false,
      };
      if (name) {
        filters.name = { contains: name, mode: "insensitive" };
      }

      if (email) {
        filters.email = { contains: email, mode: "insensitive" };
      }

      if (gender) {
        filters.gender = gender;
      }
      const skip = (Number(page) - 1) * Number(limit);
      const users = await prisma.user.findMany({
        where: filters,
        skip: skip,
        take: Number(limit),
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          description: true,
          userType: true,
          phoneNumber: true,
          gender: true,
          ProfessionalProfile: true,
          Service: true,
          Application: true,
        },
      });
      const totalUsers = await prisma.user.count({ where: filters });
      res.status(200).json({
        users,
        pagination: {
          total: totalUsers,
          currentPage: Number(page),
          totalPages: Math.ceil(totalUsers / Number(limit)),
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}
