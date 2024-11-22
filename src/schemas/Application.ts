import z from "zod";

export const createApplicationSchema = z.object({
  serviceId: z.string().uuid("Service ID must be a valid UUID"),
  status: z.enum(["Pending", "Accepted", "Rejected"]).optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(["Accepted", "Rejected"], {
    errorMap: () => ({ message: "Invalid status" }),
  }),
});

export const applyForServiceSchema = z.object({
  serviceId: z.string().uuid().min(1, "serviceId is required"),
});
