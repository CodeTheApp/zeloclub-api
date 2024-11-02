import { Request, Response } from 'express';
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
    const { title, description, payment, requirements } = req.body;
    const user = await UserRepository.findOne({
      where: { id: (req as any).user.id },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const service = ServiceRepository.create({
      title,
      description,
      payment,
      requirements,
      createdBy: user,
    });

    await ServiceRepository.save(service);
    res.status(201).json(service);
  }

  static async getAllServices(req: Request, res: Response) {
    const services = await ServiceRepository.find({
      where: { isActive: true, isDeleted: false },
    });
    res.status(200).json(services);
  }
}
