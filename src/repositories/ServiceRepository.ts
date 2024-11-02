import { AppDataSource } from '../config/ormconfig';
import { Service } from '../entities/Service';

export const ServiceRepository = AppDataSource.getRepository(Service);
