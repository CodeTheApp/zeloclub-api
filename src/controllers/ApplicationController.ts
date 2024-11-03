// src/controllers/ApplicationController.ts
import { Request, Response } from 'express';
import { USER_TYPES } from '../entities/User';
import { ApplicationRepository } from '../repositories/ApplicationRepository';
import { ServiceRepository } from '../repositories/ServiceRepository';
import { UserRepository } from '../repositories/UserRepository';
import { sendNotificationEmail } from '../services/emailService';

export class ApplicationController {
  static async updateApplicationStatus(req: Request, res: Response) {
    const { applicationId } = req.params;
    const { status } = req.body; // Novo status, esperado como "Accepted" ou "Rejected"
    const userId = (req as any).user.id; // ID do usuário autenticado
    const userType = (req as any).user.userType; // Tipo do usuário autenticado

    // Validar se o novo status é permitido
    const allowedStatuses = ['Accepted', 'Rejected'];
    if (!allowedStatuses.includes(status)) {
      res.status(400).json({ message: 'Invalid status' });
      return;
    }

    // Buscar a aplicação pelo ID
    const application = await ApplicationRepository.findOne({
      where: { id: applicationId },
      relations: ['service'],
    });
    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    // Verificar se o usuário é o criador do serviço ou tem perfil de backoffice
    const service = application.service;

    // Atualizar o status da aplicação
    application.status = status;
    await ApplicationRepository.save(application);

    await sendNotificationEmail(
      application.applicant.email,
      `Status de sua aplicação foi atualizado para: ${status}`,
      `O status de sua aplicação para o serviço ${service.name} foi atualizado para ${status}.`
    );

    // Responder com sucesso
    res
      .status(200)
      .json({ message: 'Application status updated successfully', status });
  }

  static async applyForService(req: Request, res: Response) {
    const { serviceId } = req.body;
    const userId = (req as any).user.id;

    const service = await ServiceRepository.findOne({
      where: { id: serviceId, isActive: true, isDeleted: false },
      relations: ['createdBy'],
      select: ['id', 'name', 'createdBy', 'description', 'location'],
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
      where: { service: { id: serviceId }, applicant: { id: userId } },
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
      relations: [
        'applications',
        'applications.applicant',
        'applications.service',
      ],
    });

    if (!service) {
      res.status(404).json({ message: 'Service not found' });
      return;
    }

    res.status(200).json(service.applications);
  }
}
