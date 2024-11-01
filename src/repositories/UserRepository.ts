import { AppDataSource } from '../config/ormconfig';
import { User } from '../entities/User';

export const UserRepository = AppDataSource.getRepository(User);
