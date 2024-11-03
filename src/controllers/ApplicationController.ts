// src/controllers/ApplicationController.ts
import { Request, Response } from 'express';
import { USER_TYPES } from '../entities/User';
import { ApplicationRepository } from '../repositories/ApplicationRepository';
import { ServiceRepository } from '../repositories/ServiceRepository';
import { UserRepository } from '../repositories/UserRepository';
import { sendNotificationEmail } from '../services/emailService';

export class ApplicationController {
  static async applyForService(req: Request, res: Response) {
    const { serviceId } = req.body;
    const userId = (req as any).user.id;

    const service = await ServiceRepository.findOne({
      where: { id: serviceId, isActive: true, isDeleted: false },
    });
    if (!service) {
      res.status(404).json({ message: 'Service not found' });
      return;
    }

    const applicant = await UserRepository.findOne({
      where: { id: userId, userType: USER_TYPES.PROFESSIONAL },
    });

    if (!applicant) {
      res
        .status(403)
        .json({ message: 'Only professionals can apply for services' });
      return;
    }

    const existingApplication = await ApplicationRepository.findOne({
      where: { service, applicant },
    });
    if (existingApplication) {
      res
        .status(400)
        .json({ message: 'You have already applied for this service' });
      return;
    }

    const application = ApplicationRepository.create({ service, applicant });
    await ApplicationRepository.save(application);

    // Enviar notificação para o anunciante da vaga
    await sendNotificationEmail(
      service.createdBy.email,
      `Nova aplicação para seu serviço: ${service.name}`,
      `O usuário ${applicant.name} solicitou seu serviço`
    );

    res.status(201).json({ message: 'Application submitted successfully' });
  }

  static async getApplicationsForService(req: Request, res: Response) {
    const { serviceId } = req.params;
    const service = await ServiceRepository.findOne({
      where: { id: serviceId },
      relations: ['applications'],
    });

    if (!service) {
      res.status(404).json({ message: 'Service not found' });
      return;
    }

    res.status(200).json(service.applications);
  }
}
