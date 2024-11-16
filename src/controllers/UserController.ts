import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';
import { USER_TYPES } from '../../types';
import { ProfessionalProfile } from '../entities/ProfessionalProfile';
import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';

export class UserController {
  public static readonly uploadAvatar: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const user = await UserRepository.findOneBy({ id });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (req.file && (req.file as any).location) {
      // (req.file as any).location contém o URL do arquivo no S3
      user.avatar = (req.file as any).location;
      await UserRepository.save(user);

      res.status(200).json({
        message: 'Avatar uploaded successfully',
        avatarUrl: user.avatar,
      });
    } else {
      res.status(400).json({ message: 'No file uploaded' });
    }
  };

  public static readonly deleteUser: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const user = await UserRepository.findOneBy({ id });
    if (!user || user.isDeleted) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    await UserRepository.softDeleteUser(id);
    res.status(200).json({ message: 'User has been soft deleted' });
  };

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

      // Encontra o usuário pelo ID
      const user = await UserRepository.findOne({
        where: { id },
        relations: ['professionalProfile'],
      });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return; // Apenas sai da função, sem retornar um valor
      }

      // Se o usuário ainda não é um profissional, transforma-o em um
      if (user.userType !== USER_TYPES.PROFESSIONAL) {
        user.userType = USER_TYPES.PROFESSIONAL;
      }

      // Verifica se o usuário já possui um perfil profissional
      let professionalProfile = user.professionalProfile;
      if (!professionalProfile) {
        // Cria um novo perfil profissional se ele não existir
        professionalProfile = new ProfessionalProfile();
      }

      // Atualiza os dados do perfil profissional
      professionalProfile.location = location;
      professionalProfile.specialty = specialty;
      professionalProfile.experience = experience;
      professionalProfile.rating = rating || 0;
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

      // Salva o usuário e o perfil atualizado
      await UserRepository.save(user);

      res.status(200).json({ message: 'Profile completed successfully', user });
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
      console.error(error);
      res.status(500).json({
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  public static readonly getAllUsers: RequestHandler = async (req, res) => {
    try {
      const users = await UserRepository.find({
        relations: ['professionalProfile'],
        where: { isDeleted: false },
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
      const users = await UserRepository.find({
        where: { userType: USER_TYPES.BACKOFFICE, isDeleted: false },
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
