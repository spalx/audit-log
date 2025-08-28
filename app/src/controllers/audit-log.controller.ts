import { CreateLogDTO, DidCreateLogDTO } from 'audit-log-pkg';
import { transportService, CorrelatedRequestDTO, CorrelatedRequestDTOSchema } from 'transport-pkg';
import { logger } from 'common-loggers-pkg';

import { CreateLogDTOSchema } from '@/common/constants';
import auditLogService from '@/services/audit-log/audit-log.service';

class AuditLogController {
  async createLog(dto: CorrelatedRequestDTO<CreateLogDTO>): Promise<void> {
    let error: unknown | null = null;
    let responseData: DidCreateLogDTO | {} = {};

    try {
      CorrelatedRequestDTOSchema.parse(dto);
      CreateLogDTOSchema.parse(dto.data);

      responseData = auditLogService.createLog(dto.data);
    } catch (err) {
      logger.error('Failed to create log', err);
      error = err;
    } finally {
      this.sendResponseForRequest(dto, responseData, error);
    }
  }

  private sendResponseForRequest(req: CorrelatedRequestDTO, responseData: object, error: unknown | null) {
    const { action, data, correlation_id, request_id, transport_name } = req;

    const responseRequest: CorrelatedRequestDTO = {
      correlation_id,
      request_id,
      action,
      transport_name,
      data: responseData,
    };

    transportService.sendResponse(responseRequest, error);
  }
}

export default new AuditLogController();
