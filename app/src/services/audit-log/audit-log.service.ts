import { LogDTO } from 'audit-log-pkg';
import { GetAllRestQueryParams } from 'rest-pkg';

import { AuditLog, AuditLogDocument } from '@/models/audit-log.model';
import { applyRestQueryParams } from '@/common/utils';

class AuditLogService {
  async createLog(data: LogDTO): Promise<void> {
    const auditLog = new AuditLog({
      author: data.author,
      action: data.action,
    });

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

  async getLogs(data: GetAllRestQueryParams): Promise<{ logs: AuditLogDocument[], count: number }> {
    const query = AuditLog.find();
    const qb = applyRestQueryParams(query, data);
    const [logs, count] = await Promise.all([
      qb.exec(),
      AuditLog.countDocuments(qb.getFilter())
    ]);

    return { logs, count };
  }
}

export default new AuditLogService();
