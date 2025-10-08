import { Column, Entity, Index } from 'typeorm';
import { LogDTO } from 'audit-log-pkg';

import BaseEntity from '@/entities/base.entity';

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

  output(): LogDTO {
    return {
      author: this.author,
      action: this.action,
      target_id: this.target_id,
      date: this.date,
      meta: this.meta ?? {}
    }
  }
}
