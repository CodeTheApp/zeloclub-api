import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class MigrateServices1663396000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'services',
        columns: [
          new TableColumn({
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          }),
          new TableColumn({
            name: 'name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          }),
          new TableColumn({
            name: 'description',
            type: 'text',
            isNullable: false,
          }),
          new TableColumn({
            name: 'schedules',
            type: 'jsonb',
            isNullable: false,
          }),
          new TableColumn({
            name: 'advertiser',
            type: 'varchar',
            length: '100',
            isNullable: false,
          }),
          new TableColumn({
            name: 'value',
            type: 'varchar',
            default: "'A combinar'",
          }),
          new TableColumn({
            name: 'location',
            type: 'jsonb',
            isNullable: false,
          }),
          new TableColumn({
            name: 'contactPhone',
            type: 'varchar',
            length: '15',
            isNullable: false,
          }),
          new TableColumn({
            name: 'isActive',
            type: 'boolean',
            default: true,
          }),
          new TableColumn({
            name: 'isDeleted',
            type: 'boolean',
            default: false,
          }),
          new TableColumn({
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          }),
          new TableColumn({
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          }),
          new TableColumn({
            name: 'createdById',
            type: 'uuid',
            isNullable: false,
          }),
        ],
      })
    );

    await queryRunner.createForeignKey(
      'services',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('services');
  }
}
