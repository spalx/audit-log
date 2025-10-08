import { LogDTO, LogDTOSchema } from 'audit-log-pkg';
import { CorrelatedMessage } from 'transport-pkg';
import { GetAllRestQueryParams, GetAllRestQueryParamsSchema, GetAllRestPaginatedResponse } from 'rest-pkg';

import auditLogService from '@/services/audit-log/audit-log.service';

class AuditLogController {
  async createLog(req: CorrelatedMessage<LogDTO>): Promise<void> {
    LogDTOSchema.parse(req.data);

    await auditLogService.createLog(req.data);
  }

  async getLogs(req: CorrelatedMessage<GetAllRestQueryParams>): Promise<GetAllRestPaginatedResponse<LogDTO>> {
    GetAllRestQueryParamsSchema.parse(req.data);

    const { logs, count } = await auditLogService.getLogs(req.data);
    return { results: logs.map(log => log.output()), count };
  }
}

export default new AuditLogController();
