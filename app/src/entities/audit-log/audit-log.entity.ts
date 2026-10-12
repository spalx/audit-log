import { Column, Entity, Index, OneToMany } from 'typeorm';
import { LogDTO } from '@spalx/audit-log-pkg';

import BaseEntity from '@/entities/base.entity';
import AuditLogTokenEntity from '@/entities/audit-log-token/audit-log-token.entity';

interface AuditLogAuthor {
  id: string;
  name: string;
}

@Entity({ name: 'audit_logs' })
@Index(['action', 'target_id'])
@Index(['target_id'])
export default class AuditLogEntity extends BaseEntity {
  @Column({ type: 'jsonb' })
  author!: AuditLogAuthor;

  @Column()
  action!: string;

  @Column({ nullable: true })
  target_id?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date?: Date;

  @Column('jsonb', { nullable: true })
  declare meta: Record<string, unknown> | null;

  @OneToMany(() => AuditLogTokenEntity, (token) => token.log)
  tokens: AuditLogTokenEntity[];

  output(): LogDTO {
    return {
      author: this.author,
      action: this.action,
      target_id: this.target_id,
      date: this.date,
      meta: this.meta ?? {},
    };
  }
}
