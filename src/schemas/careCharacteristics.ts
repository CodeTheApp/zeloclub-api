import { z } from "zod";


export const createCareCharacteristicSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description cannot exceed 500 characters"),
});

export const getAllCareCharacteristicsSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  orderByName: z.enum(["asc", "desc"]).optional(),
});



export const updateCareCharacteristicSchema = z.object({
  id: z.string().uuid("Invalid UUID format for 'id'"),
  name: z
    .string().max(100, "Name cannot exceed 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description cannot exceed 500 characters"),
});

