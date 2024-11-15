import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Service } from "./Service";

@Entity("careCharacteristics")
export class CareCharacteristic {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true, length: 100 })
  name: string; // Nome da característica, por exemplo, "Cuidados básicos de higiene"

  @Column("text")
  description: string; // Descrição detalhada da característica

  // Relacionamento muitos-para-muitos com Service
  @ManyToMany(() => Service, (service) => service.careCharacteristic)
  services: Service[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ default: false })
  isDeleted: boolean;
}
