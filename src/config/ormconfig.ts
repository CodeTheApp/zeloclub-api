import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource } from 'typeorm';

import { CareCharacteristic } from '../entities/CareCharacteristic';
import { ProfessionalProfile } from '../entities/ProfessionalProfile';
import { Service } from '../entities/Service';
import { User } from '../entities/User';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [User, ProfessionalProfile, Service, CareCharacteristic],
  migrations: ['src/migration/*.ts'],
  
});
console.log("password ", process.env.DB_PASS)
AppDataSource.initialize()
  .then(() => console.log('Data Source has been initialized!'))
  .catch((err) =>
    console.error('Error during Data Source initialization', err)
  );
