import type { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

class UserRepositoryClass {
  async findOne(options: { where: Prisma.UserWhereInput }) {
    return await prisma.user.findFirst({
      where: options.where,
      include: {
        professionalProfile: true,
        services: true,
        applications: true,
      },
    });
  }

  async find(options: { where: Prisma.UserWhereInput }) {
    return await prisma.user.findMany({
      where: options.where,
      include: {
        professionalProfile: true,
        services: true,
        applications: true,
      },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data,
      include: {
        professionalProfile: true,
        services: true,
        applications: true,
      },
    });
  }

  async save(data: Prisma.UserCreateInput & { id?: string }) {
    if (data.id) {
      const { id, ...updateData } = data;
      return await prisma.user.update({
        where: { id },
        data: updateData,
        include: {
          professionalProfile: true,
          services: true,
          applications: true,
        },
      });
    }
    return this.create(data);
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return await prisma.user.update({
      where: { id },
      data,
      include: {
        professionalProfile: true,
        services: true,
        applications: true,
      },
    });
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        professionalProfile: true,
        services: true,
        applications: true,
      },
    });
  }

  async softDelete(id: string) {
    return await prisma.user.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
  }
}

export const UserRepository = new UserRepositoryClass();
