import type { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

class ProfessionalProfileRepositoryClass {
  async findOne(options: { where: Prisma.ProfessionalProfileWhereInput }) {
    return prisma.professionalProfile.findFirst({
      where: options.where,
      include: {
        user: true,
      },
    });
  }

  async find(options: { where: Prisma.ProfessionalProfileWhereInput }) {
    return prisma.professionalProfile.findMany({
      where: options.where,
      include: {
        user: true,
      },
    });
  }

  async create(data: Prisma.ProfessionalProfileCreateInput) {
    return prisma.professionalProfile.create({
      data,
      include: {
        user: true,
      },
    });
  }

  async save(data: Prisma.ProfessionalProfileCreateInput & { id?: string }) {
    if (data.id) {
      const { id, ...updateData } = data;
      return prisma.professionalProfile.update({
        where: { id },
        data: updateData,
        include: {
          user: true,
        },
      });
    }
    return this.create(data);
  }

  async update(id: string, data: Prisma.ProfessionalProfileUpdateInput) {
    return prisma.professionalProfile.update({
      where: { id },
      data,
      include: {
        user: true,
      },
    });
  }

  async findByUserId(userId: string) {
    return prisma.professionalProfile.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });
  }
}

export const ProfessionalProfileRepository =
  new ProfessionalProfileRepositoryClass();
