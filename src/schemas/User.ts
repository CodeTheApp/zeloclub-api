import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  avatar: z.string().optional(),
  description: z.string().optional(),
  gender: z.enum(["Female", "Male", "Other", "Not_Informed"]).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long").optional(),
  email: z.string().email("Invalid email address").optional(),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters long").optional(),
  avatar: z.string().optional(),
  description: z.string().optional(),
  gender: z.enum(["Female", "Male", "Other", "Not_Informed"]).optional(),
});
