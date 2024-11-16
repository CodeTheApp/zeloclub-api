import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateApplicationsTable1699674800000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'applications',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'applicant_id',
            type: 'uuid',
          },
          {
            name: 'service_id',
            type: 'uuid',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['Pending', 'Accepted', 'Rejected'],
            default: "'Pending'",
          },
          {
            name: 'is_deleted',
            type: 'boolean',
            default: false,
          },
          {
            name: 'applied_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      })
    );

    // Add foreign key for applicant (User)
    await queryRunner.createForeignKey(
      'applications',
      new TableForeignKey({
        columnNames: ['applicant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    // Add foreign key for service
    await queryRunner.createForeignKey(
      'applications',
      new TableForeignKey({
        columnNames: ['service_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'services',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('applications');

    // Drop foreign keys first
    const foreignKeys = table?.foreignKeys;
    if (foreignKeys) {
      for (const foreignKey of foreignKeys) {
        await queryRunner.dropForeignKey('applications', foreignKey);
      }
    }

    // Then drop the table
    await queryRunner.dropTable('applications');
  }
}
