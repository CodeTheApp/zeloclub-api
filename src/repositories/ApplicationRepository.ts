// src/repositories/ApplicationRepository.ts
import type { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

class ApplicationRepositoryClass {
  async findOne(options: { where: Prisma.ApplicationWhereInput }) {
    return prisma.application.findFirst({
      where: options.where,
      include: {
        applicant: true,
        service: true,
      },
    });
  }

  async find(options: { where: Prisma.ApplicationWhereInput }) {
    return prisma.application.findMany({
      where: options.where,
      include: {
        applicant: true,
        service: true,
      },
    });
  }

  async create(data: Prisma.ApplicationCreateInput) {
    return prisma.application.create({
      data,
      include: {
        applicant: true,
        service: true,
      },
    });
  }

  async save(data: Prisma.ApplicationCreateInput & { id?: string }) {
    if (data.id) {
      const { id, ...updateData } = data;
      return prisma.application.update({
        where: { id },
        data: updateData,
        include: {
          applicant: true,
          service: true,
        },
      });
    }
    return this.create(data);
  }

  async update(id: string, data: Prisma.ApplicationUpdateInput) {
    return prisma.application.update({
      where: { id },
      data,
      include: {
        applicant: true,
        service: true,
      },
    });
  }

  async softDelete(id: string) {
    return prisma.application.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
  }
}

export const ApplicationRepository = new ApplicationRepositoryClass();
