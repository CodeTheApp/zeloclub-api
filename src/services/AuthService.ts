import type { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Gender, USER_TYPES } from '../../types';
import { prisma } from '../lib/prisma';

export class AuthService {
  static async register(
    name: string,
    email: string,
    password: string,
    phoneNumber: string,
    userType: USER_TYPES,
    description?: string,
    gender: Gender = Gender.NOT_INFORMED
  ): Promise<User> {
    // Verifica email e telefone existentes em uma única query
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
    });

    if (existingUser?.email === email) {
      throw new Error('Email already in use');
    }

    if (existingUser?.phoneNumber === phoneNumber) {
      throw new Error('Phone number already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria usuário com ou sem perfil profissional em uma única transação
    const user = await prisma.user.create({
      data: {
        updatedAt: new Date,
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        userType,
        description,
        gender: 'Not_Informed',
        resetPasswordToken: null,
        resetPasswordExpires: null,
        // Se for profissional, cria o perfil automaticamente
        ...(userType === USER_TYPES.PROFESSIONAL && {
          ProfessionalProfile: {
            create: {
              location: '',
              specialty: '',
              experience: '',
              price: 0,
              rating: 0,
              reviews: 0,
              available: true,
              isPremium: false,
              validated: false,
              address: {},
              certifications: [],
              contacts: {},
              social: {},
              services: {},
              schedule: [],
              reviewsList: [],
            },
          },
        }),
      },
      include: {
        ProfessionalProfile: true,
      },
    });

    return user;
  }

  static async login(email: string, password: string): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid email or password');
    }

    if (user.isDeleted) {
      throw new Error('User is not active anymore');
    }

    const token = jwt.sign(
      { id: user.id, userType: user.userType },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    return token;
  }

  static async getUserFromToken(token: string): Promise<User> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
        userType: USER_TYPES;
      };

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        include: {
          ProfessionalProfile: true,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
