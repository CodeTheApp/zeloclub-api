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

      if (!name || !description || !careCharacteristics) {
        return res.status(400).json({
          message: 'Name, description and careCharacteristics are required',
        });
      }

      if (
        !Array.isArray(careCharacteristics) ||
        careCharacteristics.length === 0
      ) {
        return res.status(400).json({
          message: 'At least one care characteristic is required',
        });
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

      // Validar se todas as características solicitadas foram encontradas
      if (characteristics.length !== careCharacteristics.length) {
        return res.status(400).json({
          message: 'One or more care characteristics are invalid',
        });
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
          User: true,
        },
      });

      res.status(200).json(services);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
