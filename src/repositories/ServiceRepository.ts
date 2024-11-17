import type { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

class ServiceRepositoryClass {
  async findOne(options: { where: Prisma.ServiceWhereInput }) {
    return await prisma.service.findFirst({
      where: options.where,
      include: {
        careCharacteristics: true,
        createdBy: true,
        applications: true,
      },
    });
  }

  async find(options: { where: Prisma.ServiceWhereInput }) {
    return await prisma.service.findMany({
      where: options.where,
      include: {
        careCharacteristics: true,
        createdBy: true,
        applications: true,
      },
    });
  }

  async create(data: Prisma.ServiceCreateInput) {
    return await prisma.service.create({
      data,
      include: {
        careCharacteristics: true,
        createdBy: true,
        applications: true,
      },
    });
  }

  async save(data: Prisma.ServiceCreateInput & { id?: string }) {
    if (data.id) {
      const { id, ...updateData } = data;
      return await prisma.service.update({
        where: { id },
        data: updateData,
        include: {
          careCharacteristics: true,
          createdBy: true,
          applications: true,
        },
      });
    }
    return this.create(data);
  }

  async update(id: string, data: Prisma.ServiceUpdateInput) {
    return await prisma.service.update({
      where: { id },
      data,
      include: {
        careCharacteristics: true,
        createdBy: true,
        applications: true,
      },
    });
  }

  async softDelete(id: string) {
    return await prisma.service.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
  }
}

export const ServiceRepository = new ServiceRepositoryClass();
