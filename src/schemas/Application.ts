import z from "zod";

export const createApplicationSchema = z.object({
    serviceId: z.string().uuid("Service ID must be a valid UUID"),
    status: z.enum(["Pending", "Accepted", "Rejected"]).optional(),
  });
  