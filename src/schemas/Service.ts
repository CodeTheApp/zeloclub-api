import { z } from 'zod';
  export const deleteServiceSchema = z.object({
    id: z.string().uuid("Invalid service ID format"),
  })

  export const createServiceSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    schedules: z
      .array(
        z.object({
          day: z.string().min(1, "Schedule day is required"),
          time: z.string().min(1, "Schedule time is required"),
        })
      )
      .optional(),
    advertiser: z.string().optional(),
    value: z.number().nonnegative().optional(),
    location: z.string().optional(),
    contactPhone: z.string().optional(),
    careCharacteristics: z
      .array(z.string())
      .min(1, "At least one care characteristic is required"),
  });
  