import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateApplications1731774792281 implements MigrationInterface {
  name = 'CreateApplications1731774792281';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Criar ENUM para status de aplicação
    await queryRunner.query(`
            CREATE TYPE "public"."application_status_enum" AS ENUM(
                'Pending', 'Accepted', 'Rejected'
            )
        `);

    // Criar tabela principal de applications
    await queryRunner.query(`
            CREATE TABLE "applications" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "applicantId" uuid NOT NULL,
                "serviceId" uuid NOT NULL,
                "appliedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "status" "public"."application_status_enum" NOT NULL DEFAULT 'Pending',
                "isDeleted" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_applications" PRIMARY KEY ("id")
            )
        `);

    // Criar índices compostos para melhor performance
    await queryRunner.query(`
            CREATE INDEX "IDX_applications_applicant_service" 
            ON "applications" ("applicantId", "serviceId")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_applications_status" 
            ON "applications" ("status")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_applications_created" 
            ON "applications" ("createdAt" DESC)
        `);

    // Adicionar Foreign Keys
    await queryRunner.query(`
            ALTER TABLE "applications"
            ADD CONSTRAINT "FK_applications_applicant"
            FOREIGN KEY ("applicantId")
            REFERENCES "users"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "applications"
            ADD CONSTRAINT "FK_applications_service"
            FOREIGN KEY ("serviceId")
            REFERENCES "services"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);

    // Adicionar Unique Constraint para evitar duplicatas
    await queryRunner.query(`
            ALTER TABLE "applications"
            ADD CONSTRAINT "UQ_application_user_service"
            UNIQUE ("applicantId", "serviceId", "isDeleted")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover Unique Constraint
    await queryRunner.query(`
            ALTER TABLE "applications"
            DROP CONSTRAINT "UQ_application_user_service"
        `);

    // Remover Foreign Keys
    await queryRunner.query(`
            ALTER TABLE "applications"
            DROP CONSTRAINT "FK_applications_service"
        `);

    await queryRunner.query(`
            ALTER TABLE "applications"
            DROP CONSTRAINT "FK_applications_applicant"
        `);

    // Remover Índices
    await queryRunner.query(`DROP INDEX "IDX_applications_created"`);
    await queryRunner.query(`DROP INDEX "IDX_applications_status"`);
    await queryRunner.query(`DROP INDEX "IDX_applications_applicant_service"`);

    // Remover Tabela
    await queryRunner.query(`DROP TABLE "applications"`);

    // Remover ENUM
    await queryRunner.query(`DROP TYPE "public"."application_status_enum"`);
  }
}
