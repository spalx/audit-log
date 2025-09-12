import { CreateLogDTO, CreateLogDTOSchema } from 'audit-log-pkg';
import { CorrelatedMessage } from 'transport-pkg';
import { logger } from 'common-loggers-pkg';

import auditLogService from '@/services/audit-log/audit-log.service';

class AuditLogController {
  async createLog(req: CorrelatedMessage<CreateLogDTO>): Promise<void> {
    try {
      CreateLogDTOSchema.parse(req.data);

      await auditLogService.createLog(req.data);
    } catch (err) {
      logger.error('Failed to create log', err);
    }
  }
}

export default new AuditLogController();
