import type { User as PrismaUser } from '@prisma/client';

export enum Gender {
  FEMALE = 'Female',
  MALE = 'Male',
  OTHER = 'Other',
  NOT_INFORMED = 'Not_Informed',
}

export enum USER_TYPES {
  CUSTOMER = 'Customer',
  BACKOFFICE = 'Backoffice',
  PROFESSIONAL = 'Professional',
}

export type User = PrismaUser;
