import { Repository } from 'typeorm';
import { GetAllRestQueryParams, RestFilterField, RestFilterFieldOperator } from '@spalx/rest-pkg';

import { Datasource } from './datasource';
import AuditLogEntity from '@/entities/audit-log/audit-log.entity';
import appDataSource from '@/common/db/app-data-source';

class AuditLogsDatasource extends Datasource<AuditLogEntity> {
  protected fieldMap: Record<string, string> = {
    action: 'audit_log.action',
    author: "audit_log.author->>'name'",
    target_id: 'audit_log.target_id',
    date: 'DATE(audit_log.date)',
    meta: 'audit_log.meta',
    created_at: 'audit_log.created_at',
  };

  constructor(readonly params: GetAllRestQueryParams) {
    const auditLogRepository: Repository<AuditLogEntity> = appDataSource.getRepository(AuditLogEntity);
    super(auditLogRepository, params);
  }

  protected alias(): string {
    return 'audit_log';
  }

  protected buildJoins(): void {
    // No joins needed for audit logs
  }

  protected override buildFilter(dbField: string, paramName: string, filter: RestFilterField): void {
    const { name, operator, values } = filter;

    if (name === 'meta') {
      this.buildTokenFilter(operator, values, paramName);
      return;
    }

    super.buildFilter(dbField, paramName, filter);
  }

  private buildTokenFilter(operator: RestFilterFieldOperator, values: unknown[], paramName: string): void {
    const cleanValues = values.map((v) => (typeof v === 'string' ? v.toLowerCase().trim() : v));

    switch (operator) {
      case RestFilterFieldOperator.Equal:
        this.builder.andWhere(
          `EXISTS (
        SELECT 1 FROM audit_logs_tokens t 
        WHERE t.log_id = ${this.alias()}.id AND t.token_value = :val_${paramName}
      )`,
          { [`val_${paramName}`]: cleanValues[0] }
        );
        break;

      case RestFilterFieldOperator.Unequal:
        this.builder.andWhere(
          `NOT EXISTS (
        SELECT 1 FROM audit_logs_tokens t 
        WHERE t.log_id = ${this.alias()}.id AND t.token_value = :val_${paramName}
      )`,
          { [`val_${paramName}`]: cleanValues[0] }
        );
        break;

      case RestFilterFieldOperator.Contains:
        this.builder.andWhere(
          `EXISTS (
        SELECT 1 FROM audit_logs_tokens t 
        WHERE t.log_id = ${this.alias()}.id AND t.token_value LIKE :val_${paramName}
      )`,
          { [`val_${paramName}`]: `%${cleanValues[0]}%` }
        );
        break;

      case RestFilterFieldOperator.NotContains:
        this.builder.andWhere(
          `NOT EXISTS (
        SELECT 1 FROM audit_logs_tokens t 
        WHERE t.log_id = ${this.alias()}.id AND t.token_value LIKE :val_${paramName}
      )`,
          { [`val_${paramName}`]: `%${cleanValues[0]}%` }
        );
        break;

      case RestFilterFieldOperator.StartsWith:
        this.builder.andWhere(
          `EXISTS (
        SELECT 1 FROM audit_logs_tokens t 
        WHERE t.log_id = ${this.alias()}.id AND t.token_value LIKE :val_${paramName}
      )`,
          { [`val_${paramName}`]: `${cleanValues[0]}%` }
        );
        break;

      case RestFilterFieldOperator.EndsWith:
        this.builder.andWhere(
          `EXISTS (
        SELECT 1 FROM audit_logs_tokens t 
        WHERE t.log_id = ${this.alias()}.id AND t.token_value LIKE :val_${paramName}
      )`,
          { [`val_${paramName}`]: `%${cleanValues[0]}` }
        );
        break;

      default:
        break;
    }
  }

  protected override defaultSortField(): string | null {
    return 'audit_log.date';
  }
}

export default AuditLogsDatasource;
