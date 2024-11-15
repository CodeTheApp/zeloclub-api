import { AppDataSource } from "../config/ormconfig";
import { CareCharacteristic } from "../entities/CareCharacteristic";

export const CareCharacteristicRepository = AppDataSource.getRepository(
  CareCharacteristic
).extend({
  async softDeleteCareCharacteristic(id: string) {
    await this.update(id, {
      isDeleted: true,
    });
  },

  async findAllActiveCareCharacteristic() {
    return await this.find({ where: { isDeleted: false } });
  },
});
