import { Request, Response } from 'express';
import { CareCharacteristicRepository } from '../repositories/CareCharacteristicRepository';

export class CareCharacteristicController {
  // Método para criar uma nova característica de cuidado
  static async createCareCharacteristic(req: Request, res: Response) {
    const { name, description } = req.body;

    try {
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
        name,
        description,
      });

      await CareCharacteristicRepository.save(careCharacteristic);
      res.status(201).json(careCharacteristic);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Método para listar todas as características de cuidado (não deletadas)
  static async getAllCareCharacteristics(req: Request, res: Response) {
    try {
      const careCharacteristics = await CareCharacteristicRepository.find({
        where: { isDeleted: false },
      });
      res.status(200).json(careCharacteristics);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Método para atualizar uma característica de cuidado
  static async updateCareCharacteristic(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
      const careCharacteristic = await CareCharacteristicRepository.findOne({
        where: { id, isDeleted: false },
      });

      if (!careCharacteristic) {
        res.status(404).json({ message: 'Characteristic not found' });
        return;
      }

      careCharacteristic.name = name || careCharacteristic.name;
      careCharacteristic.description =
        description || careCharacteristic.description;

      await CareCharacteristicRepository.save(careCharacteristic);
      res.status(200).json(careCharacteristic);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Método para deletar (soft delete) uma característica de cuidado
  static async deleteCareCharacteristic(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const careCharacteristic = await CareCharacteristicRepository.findOne({
        where: { id, isDeleted: false },
      });

      if (!careCharacteristic) {
        res.status(404).json({ message: 'Characteristic not found' });
        return;
      }

      careCharacteristic.isDeleted = true;
      await CareCharacteristicRepository.save(careCharacteristic);
      res.status(200).json({ message: 'Characteristic has been soft deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
