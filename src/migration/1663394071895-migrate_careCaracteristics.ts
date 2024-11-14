import { MigrationInterface, QueryRunner, Table, TableColumn, TableIndex, TableUnique } from "typeorm";

export class MigrateCareCharacteristicsTable1663394071894 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "careCharacteristics",
                columns: [
                    new TableColumn({
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "uuid"
                    }),
                    new TableColumn({
                        name: "name",
                        type: "varchar",
                        length: "100",
                        isNullable: false
                    }),
                    new TableColumn({
                        name: "description",
                        type: "text",
                        isNullable: false
                    }),
                    new TableColumn({
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()"
                    }),
                    new TableColumn({
                        name: "updatedAt",
                        type: "timestamp",
                        default: "now()"
                    }),
                    new TableColumn({
                        name: "deletedAt",
                        type: "timestamp",
                        isNullable: true
                    }),
                    new TableColumn({
                        name: "isDeleted",
                        type: "boolean",
                        default: false
                    })
                ]
            })
        );

        await queryRunner.createIndex("careCharacteristics", new TableIndex({
            name: "IDX_7b9aa5ec010232156677c0e633",
            columnNames: ["name"],
            isUnique: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("careCharacteristics");
    }

}