import { CreateLogDTO, DidCreateLogDTO } from 'audit-log-pkg';

import { AuditLog } from '@/models/audit-log.model';

class AuditLogService {
  async createLog(data: CreateLogDTO): Promise<DidCreateLogDTO> {
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

    return {};
  }
}

export default new AuditLogService();
