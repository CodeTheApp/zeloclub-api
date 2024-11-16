import type { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

class UserRepositoryClass {
  async findOne(options: { where: Prisma.UserWhereInput }) {
    return prisma.user.findFirst({
      where: options.where,
      include: {
        professionalProfile: true,
        services: true,
        applications: true,
      },
    });
  }

  async find(options: { where: Prisma.UserWhereInput }) {
    return prisma.user.findMany({
      where: options.where,
      include: {
        professionalProfile: true,
        services: true,
        applications: true,
      },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
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
      return prisma.user.update({
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
    return prisma.user.update({
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
    return prisma.user.findUnique({
      where: { email },
      include: {
        professionalProfile: true,
        services: true,
        applications: true,
      },
    });
  }

  async softDelete(id: string) {
    return prisma.user.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
  }
}

export const UserRepository = new UserRepositoryClass();
