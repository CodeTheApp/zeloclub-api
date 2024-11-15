import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Gender, USER_TYPES } from '../../types';
import { ProfessionalProfile } from '../entities/ProfessionalProfile';
import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';

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
    const existingUser = await UserRepository.findOneBy({ email });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const existingPhone = await UserRepository.findOneBy({ phoneNumber });
    if (existingPhone) {
      throw new Error('Phone number already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = UserRepository.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      userType,
      description,
      gender,
    });

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    // Se o usuário for do tipo PROFESSIONAL, cria um perfil profissional vazio
    if (userType === USER_TYPES.PROFESSIONAL) {
      const professionalProfile = new ProfessionalProfile();
      user.professionalProfile = professionalProfile;
    }

    return await UserRepository.save(user);
  }

  // Função de login do usuário
  static async login(email: string, password: string): Promise<string> {
    const user = await UserRepository.findOneBy({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid email or password');
    }

    if (user.isDeleted) {
      throw new Error('User is not active anymore');
    }

    // Gerando o token JWT
    const token = jwt.sign(
      { id: user.id, userType: user.userType },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    return token;
  }
}
