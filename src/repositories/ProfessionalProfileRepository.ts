import type { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

class ProfessionalProfileRepositoryClass {
  async findOne(options: { where: Prisma.ProfessionalProfileWhereInput }) {
    return await prisma.professionalProfile.findFirst({
      where: options.where,
      include: {
        User: true,
      },
    });
  }

  async find(options: { where: Prisma.ProfessionalProfileWhereInput }) {
    return await prisma.professionalProfile.findMany({
      where: options.where,
      include: {
        User: true,
      },
    });
  }

  async create(data: Prisma.ProfessionalProfileCreateInput) {
    return await prisma.professionalProfile.create({
      data,
      include: {
        User: true,
      },
    });
  }

  async save(data: Prisma.ProfessionalProfileCreateInput & { id?: string }) {
    if (data.id) {
      const { id, ...updateData } = data;
      return await prisma.professionalProfile.update({
        where: { id },
        data: updateData,
        include: {
          User: true,
        },
      });
    }
    return this.create(data);
  }

  async update(id: string, data: Prisma.ProfessionalProfileUpdateInput) {
    return await prisma.professionalProfile.update({
      where: { id },
      data,
      include: {
        User: true,
      },
    });
  }

  async findByUserId(userId: string) {
    return await prisma.professionalProfile.findUnique({
      where: { userId },
      include: {
        User: true,
      },
    });
  }
}

export const ProfessionalProfileRepository =
  new ProfessionalProfileRepositoryClass();
