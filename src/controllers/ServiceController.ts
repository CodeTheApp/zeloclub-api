import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class ServiceController {
  static async deleteService(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const service = await prisma.service.findUnique({
        where: { id },
      });

      if (!service || service.isDeleted) {
        res.status(404).json({ message: 'Service not found' });
        return;
      }

      await prisma.service.update({
        where: { id },
        data: { isDeleted: true },
      });

      res.status(200).json({ message: 'Service has been soft deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async createService(req: Request, res: Response) {
    try {
      const DEFAULT_CARE_ID = 'a1b2c3d4-5e6f-7g8h-9i10-j11k12l13m14';

      const {
        name,
        description,
        schedules,
        advertiser,
        value,
        location,
        contactPhone,
        careCharacteristics,
      } = req.body;

      if (!name || !description || !careCharacteristics) {
         res.status(400).json({
          message: 'Name, description and careCharacteristics are required',
        });
        return
      }

      if (
        !Array.isArray(careCharacteristics) ||
        careCharacteristics.length === 0
      ) {
         res.status(400).json({
          message: 'At least one care characteristic is required',
        });
        return
      }

      const user = await prisma.user.findUnique({
        where: { id: (req as any).user.id },
      });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const characteristics = await prisma.careCharacteristic.findMany({
        where: {
          name: {
            in: careCharacteristics,
          },
        },
      });

      const characteristicIds = characteristics.map((char) => char.id);
      if (!characteristicIds.includes(DEFAULT_CARE_ID)) {
        characteristicIds.push(DEFAULT_CARE_ID);
      }

      const service = await prisma.service.create({
        data: {
          updatedAt: new Date(),
          name,
          description,
          schedules: JSON.parse(JSON.stringify(schedules)),
          advertiser,
          value,
          location,
          contactPhone,
          createdById: user.id,
          CareCharacteristic: {
            connect: characteristics.map((char) => ({ id: char.id })),
          },
        },
        include: {
          CareCharacteristic: true,
          User: true,
        },
      });

      res.status(201).json(service);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getAllServices(req: Request, res: Response) {
    try {
      const services = await prisma.service.findMany({
        where: {
          isActive: true,
          isDeleted: false,
        },
        include: {
          CareCharacteristic: true,
          User: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
      });

      res.status(200).json(services);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
