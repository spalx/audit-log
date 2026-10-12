import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAuditLogMetaToJson1779928331613 implements MigrationInterface {
  name = 'UpdateAuditLogMetaToJson1779928331613';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "audit_logs" 
      ALTER COLUMN "meta" TYPE jsonb USING "meta"::jsonb;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "audit_logs" 
      ALTER COLUMN "meta" TYPE text USING "meta"::text;
    `);
  }
}
