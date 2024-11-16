import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCareCharacteristics1731774564919
  implements MigrationInterface
{
  name = 'CreateCareCharacteristics1731774564919';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Criar tabela principal de características
    await queryRunner.query(`
            CREATE TABLE "care_characteristics" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(100) NOT NULL,
                "description" text NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "isDeleted" boolean NOT NULL DEFAULT false,
                CONSTRAINT "UQ_care_characteristic_name" UNIQUE ("name"),
                CONSTRAINT "PK_care_characteristics" PRIMARY KEY ("id")
            )
        `);

    // Criar tabela de relacionamento com serviços (many-to-many)
    await queryRunner.query(`
            CREATE TABLE "services_care_characteristics" (
                "serviceId" uuid NOT NULL,
                "careCharacteristicId" uuid NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_services_care_characteristics" 
                PRIMARY KEY ("serviceId", "careCharacteristicId")
            )
        `);

    // Criar índices para melhor performance
    await queryRunner.query(`
            CREATE INDEX "IDX_care_characteristic_service" 
            ON "services_care_characteristics" ("serviceId")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_care_characteristic_characteristic" 
            ON "services_care_characteristics" ("careCharacteristicId")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_care_characteristic_name" 
            ON "care_characteristics" ("name")
        `);

    // Adicionar Foreign Keys
    await queryRunner.query(`
            ALTER TABLE "services_care_characteristics"
            ADD CONSTRAINT "FK_service_care_characteristic_service"
            FOREIGN KEY ("serviceId")
            REFERENCES "services"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "services_care_characteristics"
            ADD CONSTRAINT "FK_service_care_characteristic_characteristic"
            FOREIGN KEY ("careCharacteristicId")
            REFERENCES "care_characteristics"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover Foreign Keys
    await queryRunner.query(`
            ALTER TABLE "services_care_characteristics"
            DROP CONSTRAINT "FK_service_care_characteristic_characteristic"
        `);

    await queryRunner.query(`
            ALTER TABLE "services_care_characteristics"
            DROP CONSTRAINT "FK_service_care_characteristic_service"
        `);

    // Remover Índices
    await queryRunner.query(`DROP INDEX "IDX_care_characteristic_name"`);
    await queryRunner.query(
      `DROP INDEX "IDX_care_characteristic_characteristic"`
    );
    await queryRunner.query(`DROP INDEX "IDX_care_characteristic_service"`);

    // Remover Tabelas
    await queryRunner.query(`DROP TABLE "services_care_characteristics"`);
    await queryRunner.query(`DROP TABLE "care_characteristics"`);
  }
}
