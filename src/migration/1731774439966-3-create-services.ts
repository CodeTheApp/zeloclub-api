import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateServices1731774439966 implements MigrationInterface {
  name = 'CreateServices1731774439966';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Criar tabela de categorias de serviço
    await queryRunner.query(`
            CREATE TABLE "service_categories" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(100) NOT NULL,
                "description" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_service_category_name" UNIQUE ("name"),
                CONSTRAINT "PK_service_categories" PRIMARY KEY ("id")
            )
        `);

    // Criar tabela principal de serviços
    await queryRunner.query(`
            CREATE TABLE "services" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(100) NOT NULL,
                "description" text NOT NULL,
                "schedules" jsonb NOT NULL,
                "advertiser" character varying(100) NOT NULL,
                "value" character varying NOT NULL DEFAULT 'A combinar',
                "location" jsonb NOT NULL,
                "contactPhone" character varying(15) NOT NULL,
                "isActive" boolean NOT NULL DEFAULT true,
                "isDeleted" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "createdById" uuid NOT NULL,
                "categoryId" uuid,
                CONSTRAINT "PK_services" PRIMARY KEY ("id")
            )
        `);

    // Criar tabela de preços dos serviços
    await queryRunner.query(`
            CREATE TABLE "service_pricing" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "serviceId" uuid NOT NULL,
                "price" decimal(10,2) NOT NULL,
                "duration" integer NOT NULL,
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_service_pricing" PRIMARY KEY ("id")
            )
        `);

    // Criar índices para melhor performance
    await queryRunner.query(`
            CREATE INDEX "IDX_services_created_by" 
            ON "services" ("createdById")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_services_category" 
            ON "services" ("categoryId")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_service_pricing_service" 
            ON "service_pricing" ("serviceId")
        `);

    // Adicionar Foreign Keys
    await queryRunner.query(`
            ALTER TABLE "services"
            ADD CONSTRAINT "FK_services_creator"
            FOREIGN KEY ("createdById")
            REFERENCES "users"("id")
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "services"
            ADD CONSTRAINT "FK_service_category"
            FOREIGN KEY ("categoryId")
            REFERENCES "service_categories"("id")
            ON DELETE SET NULL
            ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "service_pricing"
            ADD CONSTRAINT "FK_pricing_service"
            FOREIGN KEY ("serviceId")
            REFERENCES "services"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover Foreign Keys
    await queryRunner.query(`
            ALTER TABLE "service_pricing"
            DROP CONSTRAINT "FK_pricing_service"
        `);

    await queryRunner.query(`
            ALTER TABLE "services"
            DROP CONSTRAINT "FK_service_category"
        `);

    await queryRunner.query(`
            ALTER TABLE "services"
            DROP CONSTRAINT "FK_services_creator"
        `);

    // Remover índices
    await queryRunner.query(`DROP INDEX "IDX_service_pricing_service"`);
    await queryRunner.query(`DROP INDEX "IDX_services_category"`);
    await queryRunner.query(`DROP INDEX "IDX_services_created_by"`);

    // Remover tabelas
    await queryRunner.query(`DROP TABLE "service_pricing"`);
    await queryRunner.query(`DROP TABLE "services"`);
    await queryRunner.query(`DROP TABLE "service_categories"`);
  }
}
