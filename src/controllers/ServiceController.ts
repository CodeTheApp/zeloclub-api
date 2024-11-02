import { Request, Response } from 'express';
import { ServiceRepository } from '../repositories/ServiceRepository';
import { UserRepository } from '../repositories/UserRepository';

export class ServiceController {
  static async createService(req: Request, res: Response) {
    const { title, description, payment, requirements } = req.body;
    const user = await UserRepository.findOne({
      where: { id: (req as any).user.id },
    });

    if (!user || user.userType !== 'Backoffice') {
      res.status(403).json({ message: 'Access denied' });
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
    if ((req as any).user.userType !== 'Professional') {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const services = await ServiceRepository.find({
      where: { isActive: true },
    });
    res.status(200).json(services);
  }
}
