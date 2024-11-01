export type ProfessionalType = {
  userId: string;
  location: string;
  specialty: string;
  experience: string;
  rating: number;
  price: number;
  reviews: number;
  available: boolean;
  isPremium: boolean;
  validated: boolean;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    complement: string;
  };
  certifications: {
    name: string;
    category: string;
    date: string;
    validated: boolean;
  }[];
  contacts: {
    phone: string;
    email: string;
    website: string;
    whatsapp: string;
  };
  social: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  services: {
    homecare: boolean;
    nursing: boolean;
    therapy: boolean;
    physiotherapy: boolean;
    companionship: boolean;
    cleaning: boolean;
    cooking: boolean;
  };
  schedule: {
    day: string;
    from: string;
    to: string;
  }[];
  reviewsList: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    date: string;
    content: string;
  }[];
};

export type User = {
  id: string;
  name: string;
  avatar?: string;
  phoneNumber: string;
  description: string;
  password: string;
  gender: Gender;
  userType: USER_TYPES;
};

export enum Gender {
  FEMALE = 'Female',
  MALE = 'Male',
  OTHER = 'Other',
  NOT_INFORMED = 'Not Informed',
}

export enum USER_TYPES {
  CUSTOMER = 'Customer',
  BACKOFFICE = 'Backoffice',
  PROFESSIONAL = 'Professional',
}
