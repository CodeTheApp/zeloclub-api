import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from "typeorm";

export class MigrateServicesCareCharact1663399999998 implements MigrationInterface{

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "services_care_characteristic_care_characteristics",
                columns: [
                    new TableColumn({
                        name: "servicesId",
                        type: "uuid",
                        isNullable: false
                    }),
                    new TableColumn({
                        name: "careCharacteristicsId",
                        type: "uuid",
                        isNullable: false
                    })
                ],
                uniques: [
                    {
                        columnNames: ["servicesId", "careCharacteristicsId"],
                        name: "PK_102bbfce8ff9fc73cb7ed3d29be"
                    }
                ]
            })
        );

        await queryRunner.createForeignKey(
            "services_care_characteristic_care_characteristics",
            new TableForeignKey({
                columnNames: ["servicesId"],
                referencedColumnNames: ["id"],
                referencedTableName: "services",
                onDelete: "CASCADE",
                onUpdate: "CASCADE"
            })
        );

        await queryRunner.createForeignKey(
            "services_care_characteristic_care_characteristics",
            new TableForeignKey({
                columnNames: ["careCharacteristicsId"],
                referencedColumnNames: ["id"],
                referencedTableName: "careCharacteristics",
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION"
            })
        );

        await queryRunner.createIndex(
            "services_care_characteristic_care_characteristics",
            new TableIndex({
                name: "IDX_4fbf34deaf2c067c1656dab5e6",
                columnNames: ["servicesId"]
            })
        );

        await queryRunner.createIndex(
            "services_care_characteristic_care_characteristics",
            new TableIndex({
                name: "IDX_60a00f3cf11fd9bfcbebb08292",
                columnNames: ["careCharacteristicsId"]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("services_care_characteristic_care_characteristics");
    }

}