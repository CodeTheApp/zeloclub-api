// src/controllers/ApplicationController.ts
import { Request, Response } from "express";
import { USER_TYPES } from "../entities/User";
import { prisma } from "../lib/prisma";
import { sendNotificationEmail } from "../services/emailService";

export class ApplicationController {
  static async updateApplicationStatus(req: Request, res: Response) {
    const { applicationId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Accepted", "Rejected"];
    if (!allowedStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }

    try {
      const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          Service: true,
        },
      });

      if (!application) {
        res.status(404).json({ message: "Application not found" });
        return;
      }

      const updatedApplication = await prisma.application.update({
        where: { id: applicationId },
        data: { status },
        include: {
          Service: true,
        },
      });

      await sendNotificationEmail(
        "isaacsvianna@gmail.com",
        `Status de sua aplicação foi atualizado para: ${status}`,
        `O status de sua aplicação para o serviço ${application.Service.name} foi atualizado para ${status}.`
      );

      res.status(200).json({
        message: "Application status updated successfully",
        status,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async applyForService(req: Request, res: Response) {
    const { serviceId } = req.body;
    const userId = (req as any).user.id;

    try {
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
        res.status(404).json({ message: "Service not found" });
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
          message: "Only professionals can apply for services",
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
          message: "You have already applied for this service",
        });
        return;
      }

      const application = await prisma.application.create({
        data: {
          User: { connect: { id: userId } },
          updatedAt: new Date(),
          Service: { connect: { id: serviceId } },
          applicantId: userId,
          status: "Pending",
        },
        include: {
          Service: true,
          User: true,
        },
      });

      await sendNotificationEmail(
        service.User.email,
        `Nova aplicação para seu serviço: ${service.name}`,
        `O usuário ${applicant.name} solicitou seu serviço`
      );

      res.status(201).json({ message: "Application submitted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getApplicationsForService(req: Request, res: Response) {
    const { serviceId } = req.params;
  
    try {
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
        select: {
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
              Service: {
                select: {
                  id: true,
                  name: true,
                  advertiser: true,
                },
              },
            },
          },
        },
      });
  
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      return res.status(200).json(service);
    } catch (error) {
      console.error("Error fetching applications for service:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  
  
}
