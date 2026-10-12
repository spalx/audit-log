import { MigrationInterface, QueryRunner } from 'typeorm';

export class AuditLogTokensIndexes1769928331613 implements MigrationInterface {
  name = 'AuditLogTokensIndexes1769928331613';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "audit_logs_tokens" (
                                                       "log_id" uuid NOT NULL,
                                                       "token_value" varchar(255) NOT NULL,
        CONSTRAINT "PK_audit_logs_tokens" PRIMARY KEY ("log_id", "token_value"),

        CONSTRAINT "FK_audit_logs_tokens_log" FOREIGN KEY ("log_id")
        REFERENCES "audit_logs" ("id") ON DELETE CASCADE
        );
    `);

    await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "idx_tokens_value_trgm" 
            ON "audit_logs_tokens" USING gin ("token_value" gin_trgm_ops);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_tokens_value_trgm";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_tokens_key_trgm";`);
  }
}
