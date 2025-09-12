import { CreateLogDTO } from 'audit-log-pkg';

import { AuditLog } from '@/models/audit-log.model';

class AuditLogService {
  async createLog(data: CreateLogDTO): Promise<void> {
    const auditLog = new AuditLog({
      client: data.client,
      author: data.author,
      action: data.action,
    });

    if (data.date) {
      auditLog.date = data.date;
    }

    if (data.meta) {
      auditLog.meta = data.meta;
    }

    await auditLog.save();
  }
}

export default new AuditLogService();
