import { Repository } from 'typeorm';
import { LogDTO } from 'audit-log-pkg';
import { GetAllRestQueryParams } from 'rest-pkg';

import AuditLogEntity from '@/entities/audit-log/audit-log.entity';
import appDataSource from '@/config/db.config';
import { applyRestQueryParams } from '@/common/utils';

class AuditLogService {
  private auditLogRepository: Repository<AuditLogEntity> = appDataSource.getRepository(AuditLogEntity);

  async createLog(data: LogDTO): Promise<void> {
    const auditLog = new AuditLogEntity();

    auditLog.author = data.author;
    auditLog.action = data.action;

    if (data.target_id) {
      auditLog.target_id = data.target_id;
    }

    if (data.date) {
      auditLog.date = data.date;
    }

    if (data.meta) {
      auditLog.meta = data.meta;
    }

    await auditLog.save();
  }

  async getLogs(data: GetAllRestQueryParams): Promise<{ logs: AuditLogEntity[], count: number }> {
    const validFields = ['action', 'author', 'target_id', 'date', 'meta'];

    // 1. Deduplicate and filter requested fields
    const requestedFields = Array.from(new Set(data.fields ?? [])).filter(f =>
      validFields.includes(f)
    );

    // 2. Start query builder
    let qb = this.auditLogRepository.createQueryBuilder('audit_log');

    // 3. Call generic helper
    const queryParams: Partial<GetAllRestQueryParams> = { ...data };
    if (requestedFields.length > 0) {
      queryParams.fields = requestedFields;
    }
    applyRestQueryParams(qb, 'audit_log', queryParams);

    // 4. Execute query
    const [logs, count] = await qb.getManyAndCount();

    return { logs, count };
  }
}

export default new AuditLogService();
