import { AppDataSource } from "../config/ormconfig";
import { Service } from "../entities/Service";

export const ServiceRepository = AppDataSource.getRepository(Service).extend({
  async softDeleteService(id: string) {
    await this.update(id, {
      isDeleted: true,
      isActive: false,
    });
  },

  async findAllActiveServices() {
    return await this.find({ where: { isDeleted: false } });
  },
});
