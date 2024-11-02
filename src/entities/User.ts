import { IsEmail, IsEnum, IsOptional, Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProfessionalProfile } from './ProfessionalProfile';
import { Service } from './Service';

enum Gender {
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

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  @Length(3, 100)
  name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column()
  @Length(6, 100)
  password: string;

  @Column({ nullable: true })
  @IsOptional()
  avatar?: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  description: string;

  @Column({ type: 'enum', enum: Gender, default: Gender.NOT_INFORMED })
  @IsEnum(Gender)
  gender: Gender;

  @Column({ type: 'enum', enum: USER_TYPES, default: USER_TYPES.CUSTOMER })
  @IsEnum(USER_TYPES)
  userType: USER_TYPES;

  @OneToOne(() => ProfessionalProfile, (profile) => profile.user, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  professionalProfile?: ProfessionalProfile;

  @OneToMany(() => Service, (service) => service.createdBy)
  services: Service[];

  @Column({ type: 'varchar', nullable: true })
  resetPasswordToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires: Date | null;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
