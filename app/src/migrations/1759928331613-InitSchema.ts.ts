import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1759928331613 implements MigrationInterface {
    name = 'InitSchema1759928331613'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "audit_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "meta" text, "author" jsonb NOT NULL, "action" character varying NOT NULL, "target_id" character varying, "date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_07fefa57f7f5ab8fc3f52b3ed0b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7368834c55d62d1853a7eef090" ON "audit_logs" ("target_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_042045da599a99a2fa54a43990" ON "audit_logs" ("action", "target_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_042045da599a99a2fa54a43990"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7368834c55d62d1853a7eef090"`);
        await queryRunner.query(`DROP TABLE "audit_logs"`);
    }

}
