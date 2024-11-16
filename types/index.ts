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
  FEMALE = "Female",
  MALE = "Male",
  OTHER = "Other",
  NOT_INFORMED = "Not Informed",
}

export enum USER_TYPES {
  CUSTOMER = "Customer",
  BACKOFFICE = "Backoffice",
  PROFESSIONAL = "Professional",
}

// SERVICE TYPES

export type ScheduleType = {
  day: string; // Exemplo: "Segunda-feira"
  from: string; // Horário de início, exemplo: "08:00"
  to: string; // Horário de término, exemplo: "17:00"
  shift?: string; // Turno, exemplo: "diurno" ou "noturno"
  frequency?: string; // Exemplo: "12 horas trabalhadas X dias de descanso"
};

export type Service = {
  id: string;
  name: string; // Nome da vaga
  description: string; // Descrição da vaga
  schedules: ScheduleType[]; // Lista de dias e horários do plantão
  advertiser: string; // Anunciante
  value: string; // Valor do plantão, "A combinar" por padrão
  location: {
    zip: string;
    street?: string;
    city?: string;
    state?: string;
    complement?: string;
  }; // Localização com informações opcionais de endereço completo
  contactPhone: string; // Telefone para contato
  characteristics: CareCharacteristic[]; // Lista de características de cuidado associadas
  isDeleted: boolean; // Indica se o serviço foi excluído
  createdAt: Date;
  updatedAt: Date;
};

// CareCharacteristic
export type CareCharacteristic = {
  id: string;
  name: string; // Nome da característica de cuidado
  description: string; // Descrição detalhada da característica
};
