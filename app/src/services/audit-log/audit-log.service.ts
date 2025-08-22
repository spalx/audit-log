import { CreateLogDTO, DidCreateLogDTO } from 'audit-log-pkg';
import { transportService, CorrelatedRequestDTO, CorrelatedRequestDTOSchema } from 'transport-pkg';
import { logger } from 'common-loggers-pkg';

import { AuditLog } from '@/models/audit-log.model';
import { CreateLogDTOSchema } from '@/common/constants';

class AuditLogService {
  async createLog(requestData: CorrelatedRequestDTO<CreateLogDTO>): Promise<void> {
    const { action, data, correlation_id, request_id, transport_name } = requestData;

    let error: unknown | null = null;

    try {
      CorrelatedRequestDTOSchema.parse(requestData);
      CreateLogDTOSchema.parse(data);

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
    } catch (err) {
      logger.error('Failed to create log', err);
      error = err;
    } finally {
      const responseRequest: CorrelatedRequestDTO<DidCreateLogDTO> = {
        correlation_id,
        request_id,
        action,
        transport_name,
        data: {},
      };

      transportService.sendResponse(responseRequest, error);
    }
  }
}

export default new AuditLogService();
