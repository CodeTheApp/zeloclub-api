import { Request, Response } from 'express';
import { USER_TYPES } from '../entities/User';
import { prisma } from '../lib/prisma';
import { sendNotificationEmail } from '../services/emailService';
import { applyForServiceSchema, updateApplicationStatusSchema } from '../schemas/Application';

export class ApplicationController {
  static async updateApplicationStatus(req: Request, res: Response) {
    const { applicationId } = req.params;
    const { status } = req.body;
    const requestUserId = (req as any).user.id;
    const requestUserType = (req as any).user.userType;
    try {
      const result = updateApplicationStatusSchema.safeParse({ status });

    if (!result.success) {
      return res.status(400).json({ message: result.error.errors[0].message });
    }
      const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          Service: {
            select: {
              id: true,
              name: true,
              createdById: true,
              advertiser: true,
            },
          },
        },
      });

      if (!application) {
        res.status(404).json({ message: 'Application not found' });
        return;
      }

      // Verifica se o usuário é o criador do serviço ou backoffice
      if (
        application.Service.createdById !== requestUserId &&
        requestUserType !== 'BACKOFFICE'
      ) {
        res
          .status(403)
          .json({ message: 'Not authorized to update this application' });
        return;
      }

      if (status === 'Accepted') {
        await prisma.$transaction([
          // Atualiza o serviço para não aceitar mais aplicações
          prisma.service.update({
            where: { id: application.Service.id },
            data: {
              acceptApplications: false,
              updatedAt: new Date(),
            },
          }),
          // Rejeita todas as outras aplicações do mesmo serviço
          prisma.application.updateMany({
            where: {
              serviceId: application.Service.id,
              id: { not: applicationId }, // Exclui a aplicação atual
              status: { not: 'Rejected' }, // Atualiza apenas as que não estão rejeitadas
            },
            data: {
              status: 'Rejected',
            },
          }),
          // Atualiza a aplicação atual
          prisma.application.update({
            where: { id: applicationId },
            data: { status },
            include: {
              Service: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          }),
        ]);
      } else {
        // Se não for Accepted, apenas atualiza a aplicação atual
        await prisma.application.update({
          where: { id: applicationId },
          data: { status },
          include: {
            Service: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });
      }

      await sendNotificationEmail(
        'isaacsvianna@gmail.com',
        status,
        application.Service.name
      );
      res.status(200).json({
        message: 'Application status updated successfully',
        status,
      });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }

  static async applyForService(req: Request, res: Response) {
    const { serviceId } = req.body;
    const userId = (req as any).user.id;

    try {
      const result = applyForServiceSchema.safeParse({ serviceId });

    if (!result.success) {
      return res.status(400).json({ message: result.error.errors[0].message });
    }
      const service = await prisma.service.findFirst({
        where: {
          id: serviceId,
          isActive: true,
          isDeleted: false,
        },
        include: {
          User: true,
        },
      });

      if (!service) {
        res.status(404).json({ message: 'Service not found' });
        return;
      }

      const applicant = await prisma.user.findFirst({
        where: {
          id: userId,
          userType: USER_TYPES.PROFESSIONAL,
        },
      });

      if (!applicant) {
        res.status(403).json({
          message: 'Only professionals can apply for services',
        });
        return;
      }

      const existingApplication = await prisma.application.findFirst({
        where: {
          serviceId,
          applicantId: userId,
        },
      });

      if (existingApplication) {
        res.status(400).json({
          message: 'You have already applied for this service',
        });
        return;
      }

      await prisma.application.create({
        data: {
          User: { connect: { id: userId } },
          updatedAt: new Date(),
          Service: { connect: { id: serviceId } },
          status: 'Pending',
        },
        include: {
          Service: {
            select: {
              name: true,
              id: true,
            },
          },
          User: {
            select: {
              name: true,
              email: true,
              id: true,
              avatar: true,
            },
          },
        },
      });

      await sendNotificationEmail(
        // service.User.email,
        'isaacsvianna@gmail.com',
        `Nova aplicação para seu serviço: ${service.name}`,
        `O usuário ${applicant.name} solicitou seu serviço`
      );

      res.status(201).json({ message: 'Application submitted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getApplicationsForService(req: Request, res: Response) {
    const { serviceId } = req.params;

    try {
      const result = applyForServiceSchema.safeParse({ serviceId });

    if (!result.success) {
      return res.status(400).json({ message: result.error.errors[0].message });
    }
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
        select: {
          id: true,
          name: true,
          advertiser: true,
          Application: {
            select: {
              id: true,
              appliedAt: true,
              status: true,
              isDeleted: true,
              createdAt: true,
              updatedAt: true,
              User: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });

      if (!service) {
        res.status(404).json({ message: 'Service not found' });
        return;
      }

      res.status(200).json(service);
    } catch (error) {
      console.error('Error fetching applications for service:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
