import { Request, Response } from 'express';
import { CareCharacteristicRepository } from '../repositories/CareCharacteristicRepository';
import { DEFAULT_CARE_CHARACTERISTICS } from '../util/constants';
import { ServiceRepository } from '../repositories/ServiceRepository';
import {
  createCareCharacteristicSchema,
  getAllCareCharacteristicsSchema,
  updateCareCharacteristicSchema,
} from '../schemas/careCharacteristics';

export class CareCharacteristicController {
  static async createCareCharacteristic(req: Request, res: Response) {
    const { name, description } = req.body;
    try {
      const validation = createCareCharacteristicSchema.safeParse(req.body);

      if (!validation.success) {
        const errors = validation.error.errors.map((err) => err.message);
        res.status(400).json({ message: errors.join(', ') });
        return;
      }

      if (!description) {
        res.status(400).json({ message: 'Description is required' });
        return;
      }
      const existingCharacteristic = await CareCharacteristicRepository.findOne(
        {
          where: { name },
        }
      );

      if (existingCharacteristic) {
        res.status(400).json({ message: 'Characteristic already exists' });
        return;
      }

      const careCharacteristic = CareCharacteristicRepository.create({
        updatedAt: new Date(),
        name,
        description,
      });

      const savedCharacteristic = await CareCharacteristicRepository.save(
        careCharacteristic
      );
      res.status(201).json(savedCharacteristic);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  //GET /care-characteristics?name=teste&description=teste&orderByName=desc
  static async getAllCareCharacteristics(req: Request, res: Response) {
    const { name, description, orderByName } = req.query;
    try {
      const validation = getAllCareCharacteristicsSchema.safeParse(req.query);

      if (!validation.success) {
        const errors = validation.error.errors.map((err) => err.message);
        res.status(400).json({ message: errors.join(', ') });
        return;
      }

      const whereConditions: any = {};
      if (name) {
        whereConditions.name = { contains: name, mode: 'insensitive' };
      }
      if (description) {
        whereConditions.description = {
          contains: description,
          mode: 'insensitive',
          deletedAt:null,
        };
      }
      const careCharacteristics = await CareCharacteristicRepository.find({
        where: whereConditions,
        orderBy: orderByName === 'desc' ? 'desc' : 'asc',
        
      });
      const result = careCharacteristics.map((careCharacteristic) => ({
        ...careCharacteristic,
        serviceCount: careCharacteristic.Service.length,
      }));
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updateCareCharacteristic(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
      const validation = updateCareCharacteristicSchema.safeParse({
        id,
        name,
        description,
      });

      if (!validation.success) {
        const errors = validation.error.errors.map((err) => err.message);
        res.status(400).json({ message: errors.join(', ') });
        return;
      }

      if (!description) {
        res.status(400).json({ message: 'Description is required' });
        return;
      }

      const careCharacteristic = await CareCharacteristicRepository.findOne({
        where: { id, deletedAt: null  },
      });

      if (name && name !== careCharacteristic?.name) {
        const existingCharacteristic =
          await CareCharacteristicRepository.findOne({
            where: { name, deletedAt: null },
          });

        if (existingCharacteristic) {
          res.status(400).json({ message: 'Name already exists' });
          return;
        }
      }
      if (!careCharacteristic) {
        res.status(404).json({ message: 'Characteristic not found' });
        return;
      }

      const updatedCharacteristic = await CareCharacteristicRepository.update(
        id,
        {
          name: name || careCharacteristic.name,
          description,
          updatedAt: new Date(),
        }
      );

      const activeServices = await ServiceRepository.find({
        where: {
          isActive: true,
          deletedAt: null,
          CareCharacteristic: {
            some: {
              id,
            },
          },
        },
      });

      if (activeServices.length > 0) {
        for (const service of activeServices) {
          await ServiceRepository.update(service.id, {
            CareCharacteristic: {
              connect: { id },
            },
          });
        }
      }

      res.status(200).json(updatedCharacteristic);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async deleteCareCharacteristic(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const validation = createCareCharacteristicSchema.safeParse({ id });
      if (!validation.success) {
        const errors = validation.error.errors.map((err) => err.message);
        res.status(400).json({ message: errors.join(', ') });
        return;
      }

      if (DEFAULT_CARE_CHARACTERISTICS.includes(id)) {
        res.status(400).json({
          message: 'Cannot delete default care characteristics.',
        });
      }
      const careCharacteristic = await CareCharacteristicRepository.findOne({
        where: { id, deletedAt: null },
      });

      const activeServices = await ServiceRepository.find({
        where: {
          isActive: true,
          deletedAt: null,
          CareCharacteristic: { some: { id: id } },
        },
      });

      if (activeServices.length > 0) {
        res.status(400).json({
          message:
            'Cannot delete care characteristic because it is linked to active services.',
        });
        return;
      }

      if (!careCharacteristic) {
        res.status(404).json({ message: 'Characteristic not found' });
        return;
      }

      await CareCharacteristicRepository.softDeleteCareCharacteristic(id);
      res.status(200).json({ message: 'Characteristic has been soft deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
