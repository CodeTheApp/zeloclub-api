import type { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

class UserRepositoryClass {
  async findOne(options: { where: Prisma.UserWhereInput }) {
    return await prisma.user.findFirst({
      where: options.where,
      include: {
        ProfessionalProfile: true,
        Service: true,
        Application: true,
      },
    });
  }

  async find(options: { where: Prisma.UserWhereInput }) {
    return await prisma.user.findMany({
      where: options.where,
     include: {
        ProfessionalProfile: true,
        Service: true,
        Application: true,
      },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data,
     include: {
        ProfessionalProfile: true,
        Service: true,
        Application: true,
      },
    });
  }

  async save(data: Prisma.UserCreateInput & { id?: string }) {
    if (data.id) {
      const { id, ...updateData } = data;
      return await prisma.user.update({
        where: { id ,deletedAt: null},
        data: updateData,
        include: {
          ProfessionalProfile: true,
          Service: true,
          Application: true,
        },
      });
    }
    return this.create(data);
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return await prisma.user.update({
      where: { id,deletedAt: null },
      data,
     include: {
        ProfessionalProfile: true,
        Service: true,
        Application: true,
      },
    });
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email,deletedAt: null },
     include: {
        ProfessionalProfile: true,
        Service: true,
        Application: true,
      },
    });
  }

  async softDelete(id: string) {
    return await prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

export const UserRepository = new UserRepositoryClass();
