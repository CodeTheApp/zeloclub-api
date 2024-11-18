// src/repositories/ApplicationRepository.ts
import type { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

class ApplicationRepositoryClass {
  async findOne(options: { where: Prisma.ApplicationWhereInput }) {
    return await prisma.application.findFirst({
      where: options.where,
      include: {
        // applicant: true,
        Service: true,
      },
    });
  }

  async find(options: { where: Prisma.ApplicationWhereInput }) {
    return await prisma.application.findMany({
      where: options.where,
      include: {
        // applicant: true,
        Service: true,
      },
    });
  }

  async create(data: Prisma.ApplicationCreateInput) {
    return await prisma.application.create({
      data,
      include: {
        // applicant: true,
        Service: true,
      },
    });
  }

  async save(data: Prisma.ApplicationCreateInput & { id?: string }) {
    if (data.id) {
      const { id, ...updateData } = data;
      return await prisma.application.update({
        where: { id },
        data: updateData,
        include: {
          // applicant: true,
          Service: true,
        },
      });
    }
    return this.create(data);
  }

  async update(id: string, data: Prisma.ApplicationUpdateInput) {
    return await prisma.application.update({
      where: { id },
      data,
      include: {
        // applicant: true,
        Service: true,
      },
    });
  }

  async softDelete(id: string) {
    return await prisma.application.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
  }
}

export const ApplicationRepository = new ApplicationRepositoryClass();
