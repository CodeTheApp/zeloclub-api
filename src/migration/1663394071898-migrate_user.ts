import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableUnique,
} from 'typeorm';

export class MigrateUsersTable1663395000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
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
            name: 'email',
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'phoneNumber',
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'password',
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'avatar',
            type: 'varchar',
            isNullable: true,
          }),
          new TableColumn({
            name: 'description',
            type: 'text',
            isNullable: true,
          }),
          new TableColumn({
            name: 'gender',
            type: 'enum',
            enum: ['Not Informed', 'Male', 'Female', 'Other'],
            default: "'Not Informed'",
          }),
          new TableColumn({
            name: 'userType',
            type: 'enum',
            enum: ['Customer', 'Professional'],
            default: "'Customer'",
          }),
          new TableColumn({
            name: 'resetPasswordToken',
            type: 'varchar',
            isNullable: true,
          }),
          new TableColumn({
            name: 'resetPasswordExpires',
            type: 'timestamp',
            isNullable: true,
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
            name: 'professionalProfileId',
            type: 'uuid',
            isNullable: true,
          }),
        ],
      })
    );

    await queryRunner.createUniqueConstraint(
      'users',
      new TableUnique({
        name: 'UQ_1e3d0240b49c40521aaeb953293',
        columnNames: ['phoneNumber'],
      })
    );

    await queryRunner.createUniqueConstraint(
      'users',
      new TableUnique({
        name: 'UQ_97672ac88f789774dd47f7c8be3',
        columnNames: ['email'],
      })
    );

    await queryRunner.createUniqueConstraint(
      'users',
      new TableUnique({
        name: 'REL_81a571d9a332a41eadd3a02723',
        columnNames: ['professionalProfileId'],
      })
    );

    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['professionalProfileId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'professional_profiles',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
