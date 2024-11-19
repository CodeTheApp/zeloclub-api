import { Request, Response } from 'express';
import { CareCharacteristicRepository } from '../repositories/CareCharacteristicRepository';
import { DEFAULT_CARE_CHARACTERISTICS } from '../util/constants';
import { ServiceRepository } from '../repositories/ServiceRepository';

export class CareCharacteristicController {
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
        updatedAt: new Date,
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

      const updatedCharacteristic = await CareCharacteristicRepository.save({
        ...careCharacteristic,
        name: name || careCharacteristic.name,
        description: description || careCharacteristic.description,
      });

      res.status(200).json(updatedCharacteristic);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async deleteCareCharacteristic(req: Request, res: Response) {
    const { id } = req.params;

    try {

      if (DEFAULT_CARE_CHARACTERISTICS.includes(id)) {
        res.status(400).json({
         message: "Cannot delete default care characteristics.",
       });
     }
      const careCharacteristic = await CareCharacteristicRepository.findOne({
        where: { id, isDeleted: false },
        
      });

      const activeServices = await ServiceRepository.find({
        where: {
          isActive: true,
          isDeleted: false,
          CareCharacteristic:{some:{id:id}} 
        },
      });
  
      if (activeServices.length > 0) {
            res.status(400).json({
          message:
            "Cannot delete care characteristic because it is linked to active services.",
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
