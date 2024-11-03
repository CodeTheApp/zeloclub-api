import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CareCharacteristic } from './CareCharacteristic';
import { User } from './User';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string; // Nome da vaga

  @Column('text')
  description: string; // Descrição da vaga

  @Column('jsonb')
  schedules: {
    day: string;
    from: string;
    to: string;
    shift?: string;
    frequency?: string;
  }[]; // Lista de dias e horários do plantão

  @Column({ length: 100 })
  advertiser: string; // Anunciante

  @Column({ type: 'varchar', default: 'A combinar' })
  value: string; // Valor do plantão (opcional)

  @Column('jsonb')
  location: {
    zip: string;
    street?: string;
    city?: string;
    state?: string;
    complement?: string;
  }; // Localização

  @Column({ length: 15 })
  contactPhone: string; // Telefone para contato

  // Relacionamento muitos-para-muitos com Characteristic
  @ManyToMany(
    () => CareCharacteristic,
    (careCharacteristic) => careCharacteristic.services,
    {
      cascade: true,
    }
  )
  @JoinTable()
  careCharacteristic: CareCharacteristic[]; // Lista de características associadas ao serviço

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
