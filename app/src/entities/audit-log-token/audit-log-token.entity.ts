import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import AuditLogEntity from '@/entities/audit-log/audit-log.entity';

@Entity('audit_logs_tokens')
@Index('idx_tokens_value_trgm', { synchronize: false })
export default class AuditLogTokenEntity {
  @PrimaryColumn('uuid', { name: 'log_id' })
  logId: string;

  @PrimaryColumn('varchar', { name: 'token_value', length: 255 })
  tokenValue: string;

  @ManyToOne(() => AuditLogEntity, (log) => log.tokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'log_id' })
  log: AuditLogEntity;
}
