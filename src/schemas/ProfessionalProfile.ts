import { z } from "zod";

export const createProfessionalProfileSchema = z.object({
  // Dados básicos do usuário
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters long"),
  avatar: z.string().url().optional(), // Caso o avatar seja fornecido, ele deve ser uma URL válida
  description: z.string().optional(),
  gender: z.enum(["Female", "Male", "Other", "Not_Informed"]),

  // Dados do perfil profissional
  location: z.string().min(3, "Location must be at least 3 characters long"),
  specialty: z.string().min(3, "Specialty must be at least 3 characters long"),
  experience: z
    .string()
    .min(3, "Experience description must be at least 3 characters long"),
  rating: z.number().min(0).max(5, "Rating must be between 0 and 5").optional(),
  price: z.number().positive("Price must be a positive number"),
  reviews: z.number().optional(),
  available: z.boolean().optional(),
  isPremium: z.boolean().optional(),
  validated: z.boolean().optional(),

  // Agora, ajustamos o campo 'address' para ser um objeto ou null
  address: z
    .object({
      street: z.string().min(3),
      city: z.string().min(3),
      state: z.string().min(2),
      country: z.string().min(3),
    })
    .nullable()
    .optional(), // Agora pode ser um objeto ou null (não undefined)

  certifications: z.array(z.string()).optional(),
  contacts: z
    .object({
      phone: z.string().min(10),
      email: z.string().email(),
    })
    .optional(),
  social: z
    .object({
      facebook: z.string().url().optional(),
      instagram: z.string().url().optional(),
      linkedin: z.string().url().optional(),
    })
    .optional(),
  services: z.array(z.string()).optional(),
  schedule: z
    .object({
      monday: z.boolean().optional(),
      tuesday: z.boolean().optional(),
      wednesday: z.boolean().optional(),
      thursday: z.boolean().optional(),
      friday: z.boolean().optional(),
      saturday: z.boolean().optional(),
      sunday: z.boolean().optional(),
    })
    .optional(),
  reviewsList: z.array(z.string()).optional(),
});
