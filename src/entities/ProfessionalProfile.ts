import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity("professional_profiles")
export class ProfessionalProfile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => User, (user) => user.professionalProfile)
  user: User;

  @Column()
  location: string;

  @Column()
  specialty: string;

  @Column()
  experience: string;

  @Column({ type: "float", default: 0 })
  rating: number;

  @Column({ type: "float" })
  price: number;

  @Column({ type: "int", default: 0 })
  reviews: number;

  @Column({ default: true })
  available: boolean;

  @Column({ default: false })
  isPremium: boolean;

  @Column({ default: false })
  validated: boolean;

  @Column("jsonb")
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    complement: string;
  };

  @Column("jsonb")
  certifications: {
    name: string;
    category: string;
    date: string;
    validated: boolean;
  }[];

  @Column("jsonb")
  contacts: {
    phone: string;
    email: string;
    website: string;
    whatsapp: string;
  };

  @Column("jsonb")
  social: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };

  @Column("jsonb")
  services: {
    homecare: boolean;
    nursing: boolean;
    therapy: boolean;
    physiotherapy: boolean;
    companionship: boolean;
    cleaning: boolean;
    cooking: boolean;
  };

  @Column("jsonb")
  schedule: {
    day: string;
    from: string;
    to: string;
  }[];

  @Column("jsonb")
  reviewsList: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    date: string;
    content: string;
  }[];
}
