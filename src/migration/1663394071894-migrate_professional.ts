import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class MigrateProfessionalProfilesTable1663391000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'professional_profiles',
        columns: [
          new TableColumn({
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          }),
          new TableColumn({
            name: 'location',
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'specialty',
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'experience',
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'rating',
            type: 'double precision',
            default: 0,
          }),
          new TableColumn({
            name: 'price',
            type: 'double precision',
            isNullable: false,
          }),
          new TableColumn({
            name: 'reviews',
            type: 'integer',
            default: 0,
          }),
          new TableColumn({
            name: 'available',
            type: 'boolean',
            default: true,
          }),
          new TableColumn({
            name: 'isPremium',
            type: 'boolean',
            default: false,
          }),
          new TableColumn({
            name: 'validated',
            type: 'boolean',
            default: false,
          }),
          new TableColumn({
            name: 'address',
            type: 'jsonb',
            isNullable: false,
          }),
          new TableColumn({
            name: 'certifications',
            type: 'jsonb',
            isNullable: false,
          }),
          new TableColumn({
            name: 'contacts',
            type: 'jsonb',
            isNullable: false,
          }),
          new TableColumn({
            name: 'social',
            type: 'jsonb',
            isNullable: false,
          }),
          new TableColumn({
            name: 'services',
            type: 'jsonb',
            isNullable: false,
          }),
          new TableColumn({
            name: 'schedule',
            type: 'jsonb',
            isNullable: false,
          }),
          new TableColumn({
            name: 'reviewsList',
            type: 'jsonb',
            isNullable: false,
          }),
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('professional_profiles');
  }
}
