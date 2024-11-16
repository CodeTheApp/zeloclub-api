import type { CareCharacteristic, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

class CareCharacteristicRepositoryClass {
  async findOne(options: { where: Partial<CareCharacteristic> }) {
    return prisma.careCharacteristic.findFirst({
      where: options.where,
    });
  }

  async find(options: { where: Partial<CareCharacteristic> }) {
    return prisma.careCharacteristic.findMany({
      where: options.where,
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
      return prisma.careCharacteristic.update({
        where: { id },
        data: updateData,
      });
    }
    return prisma.careCharacteristic.create({
      data: data as Prisma.CareCharacteristicCreateInput,
    });
  }

  async update(id: string, data: Prisma.CareCharacteristicUpdateInput) {
    return prisma.careCharacteristic.update({
      where: { id },
      data,
    });
  }

  // Métodos específicos
  async softDeleteCareCharacteristic(id: string) {
    return prisma.careCharacteristic.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }

  async findAllActiveCareCharacteristic() {
    return prisma.careCharacteristic.findMany({
      where: { isDeleted: false },
    });
  }
}

export const CareCharacteristicRepository =
  new CareCharacteristicRepositoryClass();
