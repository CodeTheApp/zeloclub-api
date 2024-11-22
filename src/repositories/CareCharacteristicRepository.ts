import type { CareCharacteristic, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

class CareCharacteristicRepositoryClass {
  async findOne(options: { where: Partial<CareCharacteristic> }) {
    return await prisma.careCharacteristic.findFirst({
      where: options.where,
    });
  }

  async find(options: { where: Partial<CareCharacteristic>, orderBy?: 'asc' | 'desc' }) {
    const { where, orderBy = 'asc' } = options;
  
    return await prisma.careCharacteristic.findMany({
      where: {
        ...where,
        deletedAt: null, 
      },
      orderBy: {
        name: orderBy, 
      },
      include: {
        Service: {
          where: { isActive: true, deletedAt: null }, 
          select: { id: true }, 
        },
      },
    });
  }
  

  create(data: Prisma.CareCharacteristicCreateInput) {
    return data;
  }

  async save(
    data:
      | Prisma.CareCharacteristicCreateInput
      | (Prisma.CareCharacteristicUpdateInput & { id?: string })
  ) {
    if (data.id) {
      const { id, ...updateData } = data;
      return await prisma.careCharacteristic.update({
        where: { id },
        data: updateData,
      });
    }
    return await prisma.careCharacteristic.create({
      data: data as Prisma.CareCharacteristicCreateInput,
    });
  }

  async update(id: string, data: Prisma.CareCharacteristicUpdateInput) {
    return await prisma.careCharacteristic.update({
      where: { id },
      data,
    });
  }

  // Métodos específicos
  async softDeleteCareCharacteristic(id: string) {
    return await prisma.careCharacteristic.update({
      where: { id },
      data: {
      
        deletedAt: new Date(),
      },
    });
  }

  async findAllActiveCareCharacteristic() {
    return await prisma.careCharacteristic.findMany({
      where: { deletedAt: null },
    });
  }
}

export const CareCharacteristicRepository =
  new CareCharacteristicRepositoryClass();
