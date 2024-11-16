import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Service } from './Service';
import { User } from './User';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.applications, { nullable: false })
  applicant: User; // O profissional que se candidatou

  @ManyToOne(() => Service, (service) => service.applications, {
    nullable: false,
  })
  service: Service; // A vaga à qual o profissional se candidatou

  @CreateDateColumn()
  appliedAt: Date;

  @Column({ default: 'Pending' })
  status: 'Pending' | 'Accepted' | 'Rejected';

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
