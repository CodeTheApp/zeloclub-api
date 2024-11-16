import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1731773697230 implements MigrationInterface {
  name = 'CreateUsers1731773697230';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Criar enums primeiro
    await queryRunner.query(`
            CREATE TYPE "public"."users_gender_enum" AS ENUM(
                'Female', 'Male', 'Other', 'Not Informed'
            )
        `);

    await queryRunner.query(`
            CREATE TYPE "public"."users_usertype_enum" AS ENUM(
                'Customer', 'Backoffice', 'Professional'
            )
        `);

    // Criar tabela users
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(100) NOT NULL,
                "email" character varying NOT NULL,
                "phoneNumber" character varying NOT NULL,
                "password" character varying NOT NULL,
                "avatar" character varying,
                "description" text,
                "gender" "public"."users_gender_enum" NOT NULL DEFAULT 'Not Informed',
                "userType" "public"."users_usertype_enum" NOT NULL DEFAULT 'Customer',
                "resetPasswordToken" character varying,
                "resetPasswordExpires" TIMESTAMP,
                "isDeleted" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "professionalProfileId" uuid,
                CONSTRAINT "PK_users" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_users_email" UNIQUE ("email"),
                CONSTRAINT "UQ_users_phone" UNIQUE ("phoneNumber")
            )
        `);

    // Criar índices
    await queryRunner.query(`
            CREATE INDEX "IDX_users_email" ON "users" ("email")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_users_phone" ON "users" ("phoneNumber")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índices
    await queryRunner.query(`DROP INDEX "IDX_users_phone"`);
    await queryRunner.query(`DROP INDEX "IDX_users_email"`);

    // Remover tabela
    await queryRunner.query(`DROP TABLE "users"`);

    // Remover enums
    await queryRunner.query(`DROP TYPE "public"."users_usertype_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
  }
}
