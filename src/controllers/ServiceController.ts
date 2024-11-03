import { Request, Response } from 'express';
import { CareCharacteristicRepository } from '../repositories/CareCharacteristicRepository';
import { ServiceRepository } from '../repositories/ServiceRepository';
import { UserRepository } from '../repositories/UserRepository';

export class ServiceController {
  static async deleteService(req: Request, res: Response) {
    const { id } = req.params;

    const service = await ServiceRepository.findOneBy({ id });
    if (!service || service.isDeleted) {
      res.status(404).json({ message: 'Service not found' });
      return;
    }

    await ServiceRepository.softDeleteService(id);
    res.status(200).json({ message: 'Service has been soft deleted' });
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
        careCharacteristics, // Verifique se o nome da variável corresponde ao que foi enviado no body
      } = req.body;

      const user = await UserRepository.findOne({
        where: { id: (req as any).user.id },
      });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      // Certifique-se de que careCharacteristics seja um array antes de usar .map()
      const characteristics = careCharacteristics
        ? await Promise.all(
            careCharacteristics.map(async (characteristicName: string) => {
              return await CareCharacteristicRepository.findOneBy({
                name: characteristicName,
              });
            })
          )
        : [];

      const service = ServiceRepository.create({
        name,
        description,
        schedules,
        advertiser,
        value,
        location,
        contactPhone,
        careCharacteristic: characteristics.filter(Boolean), // Remove características que não foram encontradas
        createdBy: user,
      });

      await ServiceRepository.save(service);
      res.status(201).json(service);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getAllServices(req: Request, res: Response) {
    const services = await ServiceRepository.find({
      where: { isActive: true, isDeleted: false },
      relations: ['careCharacteristic', 'createdBy'],
    });
    res.status(200).json(services);
  }
}
