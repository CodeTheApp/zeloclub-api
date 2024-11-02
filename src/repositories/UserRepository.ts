import { AppDataSource } from '../config/ormconfig';
import { User } from '../entities/User';

export const UserRepository = AppDataSource.getRepository(User).extend({
  async softDeleteUser(id: string) {
    await this.update(id, { isDeleted: true });
  },

  async findAllActiveUsers() {
    return await this.find({ where: { isDeleted: false } });
  },
});
