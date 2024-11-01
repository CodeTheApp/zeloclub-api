import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { ProfessionalProfile } from '../entities/ProfessionalProfile';
import { User } from '../entities/User';
import { USER_TYPES } from '../types';

const UserRepository = AppDataSource.getRepository(User);

export class UserController {
  // Endpoint para criar um usuário profissional
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
      const existingUser = await UserRepository.findOneBy({ email });
      if (existingUser) {
        res.status(400).json({ message: 'Email already in use' });
        return;
      }

      const existingPhone = await UserRepository.findOneBy({ phoneNumber });
      if (existingPhone) {
        res.status(400).json({ message: 'Phone number already in use' });
        return;
      }

      // Criptografa a senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Cria a instância do usuário
      const user = new User();
      user.name = name;
      user.email = email;
      user.password = hashedPassword;
      user.phoneNumber = phoneNumber;
      user.avatar = avatar;
      user.description = description;
      user.gender = gender;
      user.userType = USER_TYPES.PROFESSIONAL;

      // Cria o perfil profissional com todos os campos
      const professionalProfile = new ProfessionalProfile();
      professionalProfile.location = location;
      professionalProfile.specialty = specialty;
      professionalProfile.experience = experience;
      professionalProfile.rating = rating || 0; // Valor padrão se não fornecido
      professionalProfile.price = price;
      professionalProfile.reviews = reviews || 0;
      professionalProfile.available = available;
      professionalProfile.isPremium = isPremium;
      professionalProfile.validated = validated;
      professionalProfile.address = address;
      professionalProfile.certifications = certifications;
      professionalProfile.contacts = contacts;
      professionalProfile.social = social;
      professionalProfile.services = services;
      professionalProfile.schedule = schedule;
      professionalProfile.reviewsList = reviewsList;

      // Associa o perfil profissional ao usuário
      user.professionalProfile = professionalProfile;

      // Salva o usuário e o perfil profissional no banco de dados
      await UserRepository.save(user);

      res
        .status(201)
        .json({ message: 'Professional user created successfully', user });
    } catch (error) {
      res
        .status(500)
        .json({
          message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
  };

  // Endpoint para criar um usuário de backoffice
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

      const existingUser = await UserRepository.findOneBy({ email });
      if (existingUser) {
        res.status(400).json({ message: 'Email already in use' });
        return;
      }

      const existingPhone = await UserRepository.findOneBy({ phoneNumber });
      if (existingPhone) {
        res.status(400).json({ message: 'Phone number already in use' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User();
      user.name = name;
      user.email = email;
      user.password = hashedPassword;
      user.phoneNumber = phoneNumber;
      user.avatar = avatar;
      user.description = description;
      user.gender = gender;
      user.userType = USER_TYPES.BACKOFFICE;

      await UserRepository.save(user);

      res
        .status(201)
        .json({ message: 'Backoffice user created successfully', user });
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  // Endpoint para retornar dados do usuário por ID
  public static readonly getUserById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await UserRepository.findOne({
        where: { id },
        relations: ['professionalProfile'],
      });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  // Endpoint para retornar todos os usuários
  public static readonly getAllUsers: RequestHandler = async (req, res) => {
    try {
      const users = await UserRepository.find({
        relations: ['professionalProfile'],
      });

      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
}
