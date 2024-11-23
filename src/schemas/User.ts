import { z } from 'zod';

export const createUserSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long')
    .trim()
    .transform((val) => val.charAt(0).toUpperCase() + val.slice(1)),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters long'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password cannot exceed 50 characters')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
    .regex(/[a-z]/, 'Password must include at least one lowercase letter')
    .regex(/\d/, 'Password must include at least one number')
    .regex(/[!@#$%^&*]/, 'Password must include at least one special character (!@#$%^&*)'),
  avatar: z.string().optional(),
  description: z.string().optional(),
  gender: z.enum(['Female', 'Male', 'Other', 'Not_Informed']).optional(),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long')
    .optional(),
  email: z.string().email('Invalid email address').optional(),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters long').optional(),
  avatar: z.string().optional(),
  description: z.string().optional(),
  gender: z.enum(['Female', 'Male', 'Other', 'Not_Informed']).optional(),
});

export const getUserByIdSchema = z.object({
  id: z.string().uuid('Invalid UUID format'),
});

export const getAllUsersSchema = z.object({
  page: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val)), {
      message: 'Page must be a valid number',
    })
    .transform((val) => Number(val) || 1),
  
  pageSize: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val)), {
      message: 'Page size must be a valid number',
    })
    .transform((val) => Number(val) || 10),
  
  sortBy: z.string().optional().default('createdAt'),
  
  sortOrder: z
    .string()
    .optional()
    .refine((val) => val === 'asc' || val === 'desc', {
      message: 'Sort order must be either asc or desc',
    })
    .default('asc'),
  
  userType: z.string().optional(),
  gender: z.string().optional(),
});

export const getAllBackofficeUsersSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  gender: z.string().optional(),
  page: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val)), {
      message: 'Page must be a valid number',
    })
    .transform((val) => Number(val) || 1),
  
  limit: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val)), {
      message: 'Limit must be a valid number',
    })
    .transform((val) => Number(val) || 10),
});

export const requestPasswordResetSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password cannot exceed 50 characters')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
    .regex(/[a-z]/, 'Password must include at least one lowercase letter')
    .regex(/\d/, 'Password must include at least one number')
    .regex(/[!@#$%^&*]/, 'Password must include at least one special character (!@#$%^&*)'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .trim()
    .transform((val) => val.charAt(0).toUpperCase() + val.slice(1)),
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password cannot exceed 50 characters')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
    .regex(/[a-z]/, 'Password must include at least one lowercase letter')
    .regex(/\d/, 'Password must include at least one number')
    .regex(/[!@#$%^&*]/, 'Password must include at least one special character (!@#$%^&*)'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  userType: z.string().min(1, 'User type is required'),
  description: z.string().optional(),
  gender: z.string().min(1, 'Gender is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});
