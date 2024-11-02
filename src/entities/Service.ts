import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  payment: number; // Remuneração (opcional)

  @Column({ type: 'text', nullable: true })
  requirements: string; // Requisitos (opcional)

  @Column({ default: true })
  isActive: boolean; // Indica se a vaga está ativa

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToOne(() => User, (user) => user.services, { nullable: false })
  createdBy: User; // Relacionamento com o usuário que criou (usuário do tipo backoffice)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
