// src/controllers/ServiceController.ts
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

      const user = await prisma.user.findUnique({
        where: { id: (req as any).user.id },
      });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      // Buscar características existentes
      const characteristics = careCharacteristics
        ? await prisma.careCharacteristic.findMany({
            where: {
              name: {
                in: careCharacteristics,
              },
            },
          })
        : [];

      const service = await prisma.service.create({
        data: {
          updatedAt: new Date,
          name,
          description,
          schedules: JSON.parse(JSON.stringify(schedules)),
          advertiser,
          value,
          location,
          contactPhone,
          createdById: user.id 
          ,
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
