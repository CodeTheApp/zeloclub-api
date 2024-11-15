import { AppDataSource } from '../config/ormconfig';
import { Application } from '../entities/Application';

export const ApplicationRepository = AppDataSource.getRepository(
  Application
).extend({
  async softDeleteApplication(id: string) {
    await this.update(id, { isDeleted: true });
  },

  async findAllActiveApplications() {
    return await this.find({ where: { isDeleted: false } });
  },
});
