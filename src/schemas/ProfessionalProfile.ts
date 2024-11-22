import { z } from "zod";

export const createProfessionalSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters long"),
  avatar: z.string().url().optional(),
  description: z.string().optional(),
  gender: z.enum(['Female', 'Male', 'Other', 'Not_Informed']),
  location: z.string().min(3, "Location must be at least 3 characters long"),
  specialty: z.string().min(3, "Specialty must be at least 3 characters long"),
  experience: z.string().min(3, "Experience must be at least 3 characters long"),
  rating: z.number().min(0).max(5).optional(),
  price: z.number().positive("Price must be a positive number"),
  reviews: z.number().optional(),
  available: z.boolean().optional(),
  isCompleted: z.boolean().optional(),
  isValidated: z.boolean().optional(),
  address: z.object({
    street: z.string().min(3),
    city: z.string().min(3),
    state: z.string().min(2),
    country: z.string().min(3),
  }).nullable().optional(),
  certifications: z.array(z.string()).optional(),
  contacts: z.object({
    phone: z.string().min(10),
    email: z.string().email(),
  }).optional(),
  social: z.object({
    facebook: z.string().url().optional(),
    instagram: z.string().url().optional(),
    linkedin: z.string().url().optional(),
  }).optional(),
  services: z.array(z.string()).optional(),
  schedule: z.object({
    monday: z.boolean().optional(),
    tuesday: z.boolean().optional(),
    wednesday: z.boolean().optional(),
    thursday: z.boolean().optional(),
    friday: z.boolean().optional(),
    saturday: z.boolean().optional(),
    sunday: z.boolean().optional(),
  }).optional(),
  reviewsList: z.array(z.string()).optional(),
});

export const createBackofficeUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters long"),
  avatar: z.string().optional(),
  description: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"]),
});

export const completeProfileSchema = z.object({
  location: z.string().min(1, "Location is required"),
  specialty: z.string().min(1, "Specialty is required"),
  experience: z.number().optional(),
  rating: z.number().optional(),
  price: z.number().min(0, "Price must be a positive number"),
  reviews: z.number().optional(),
  available: z.boolean(),
  isCompleted: z.boolean().optional(),
  isValidated: z.boolean().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
  }).optional(),
  certifications: z.array(z.string()).optional(),
  contacts: z.object({
    phone: z.string().optional(),
    email: z.string().email("Invalid email format").optional(),
  }).optional(),
  social: z.object({
    facebook: z.string().url().optional(),
    twitter: z.string().url().optional(),
    linkedin: z.string().url().optional(),
  }).optional(),
  services: z.array(z.string()).optional(),
  schedule: z.array(z.object({
    day: z.string(),
    startTime: z.string(),
    endTime: z.string(),
  })).optional(),
  reviewsList: z.array(z.object({
    reviewer: z.string(),
    comment: z.string(),
    rating: z.number(),
  })).optional(),
});