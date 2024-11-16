import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProfiles1731774329290 implements MigrationInterface {
  name = 'CreateProfiles1731774329290';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Criar tabela principal de perfis profissionais
    await queryRunner.query(`
            CREATE TABLE "professional_profiles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "location" character varying NOT NULL,
                "specialty" character varying NOT NULL,
                "experience" character varying NOT NULL,
                "rating" double precision NOT NULL DEFAULT '0',
                "price" double precision NOT NULL,
                "reviews" integer NOT NULL DEFAULT '0',
                "available" boolean NOT NULL DEFAULT true,
                "isPremium" boolean NOT NULL DEFAULT false,
                "validated" boolean NOT NULL DEFAULT false,
                "address" jsonb NOT NULL,
                "certifications" jsonb NOT NULL,
                "contacts" jsonb NOT NULL,
                "social" jsonb NOT NULL,
                "services" jsonb NOT NULL,
                "schedule" jsonb NOT NULL,
                "reviewsList" jsonb NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_professional_profiles" PRIMARY KEY ("id")
            )
        `);

    // Criar tabela de qualificações
    await queryRunner.query(`
            CREATE TABLE "professional_qualifications" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying(100) NOT NULL,
                "institution" character varying(100) NOT NULL,
                "year" integer NOT NULL,
                "description" text,
                "professionalProfileId" uuid NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_professional_qualifications" PRIMARY KEY ("id")
            )
        `);

    // Criar tabela de experiências
    await queryRunner.query(`
            CREATE TABLE "professional_experiences" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "company" character varying(100) NOT NULL,
                "role" character varying(100) NOT NULL,
                "startDate" TIMESTAMP NOT NULL,
                "endDate" TIMESTAMP,
                "description" text,
                "professionalProfileId" uuid NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_professional_experiences" PRIMARY KEY ("id")
            )
        `);

    // Criar índices para melhor performance
    await queryRunner.query(`
            CREATE INDEX "IDX_prof_qualifications_profile" 
            ON "professional_qualifications" ("professionalProfileId")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_prof_experiences_profile" 
            ON "professional_experiences" ("professionalProfileId")
        `);

    // Adicionar Foreign Key na tabela users
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_user_professional_profile"
            FOREIGN KEY ("professionalProfileId")
            REFERENCES "professional_profiles"("id")
            ON DELETE SET NULL
            ON UPDATE NO ACTION
        `);

    // Adicionar Foreign Keys para as tabelas de qualificações e experiências
    await queryRunner.query(`
            ALTER TABLE "professional_qualifications"
            ADD CONSTRAINT "FK_qualification_profile"
            FOREIGN KEY ("professionalProfileId")
            REFERENCES "professional_profiles"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "professional_experiences"
            ADD CONSTRAINT "FK_experience_profile"
            FOREIGN KEY ("professionalProfileId")
            REFERENCES "professional_profiles"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover Foreign Keys
    await queryRunner.query(`
            ALTER TABLE "professional_experiences"
            DROP CONSTRAINT "FK_experience_profile"
        `);

    await queryRunner.query(`
            ALTER TABLE "professional_qualifications"
            DROP CONSTRAINT "FK_qualification_profile"
        `);

    await queryRunner.query(`
            ALTER TABLE "users"
            DROP CONSTRAINT "FK_user_professional_profile"
        `);

    // Remover índices
    await queryRunner.query(`DROP INDEX "IDX_prof_experiences_profile"`);
    await queryRunner.query(`DROP INDEX "IDX_prof_qualifications_profile"`);

    // Remover tabelas
    await queryRunner.query(`DROP TABLE "professional_experiences"`);
    await queryRunner.query(`DROP TABLE "professional_qualifications"`);
    await queryRunner.query(`DROP TABLE "professional_profiles"`);
  }
}
