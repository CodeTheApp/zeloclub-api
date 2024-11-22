import { z } from 'zod';
export const createServiceSchema = z.object({
    name: z.string().min(3, "Service name must be at least 3 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    schedules: z.object({
      monday: z.boolean().optional(),
      tuesday: z.boolean().optional(),
      wednesday: z.boolean().optional(),
      thursday: z.boolean().optional(),
      friday: z.boolean().optional(),
      saturday: z.boolean().optional(),
      sunday: z.boolean().optional(),
    }).optional(),
    advertiser: z.string().min(3, "Advertiser name must be at least 3 characters long"),
    value: z.string().min(3, "Value must be provided").optional(),
    location: z.object({
      street: z.string().min(3),
      city: z.string().min(3),
      state: z.string().min(2),
      country: z.string().min(3),
    }).optional(),
    contactPhone: z.string().min(10, "Phone number must be at least 10 characters long"),
    isActive: z.boolean().optional(),
    quantityVacancies: z.number().min(1, "At least 1 vacancy must be available").optional(),
  });
  