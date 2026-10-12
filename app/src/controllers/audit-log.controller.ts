import { LogDTO, LogDTOSchema } from '@spalx/audit-log-pkg';
import { CorrelatedMessage } from '@spalx/transport-pkg';
import { GetAllRestQueryParams, GetAllRestQueryParamsSchema, GetAllRestPaginatedResponse } from '@spalx/rest-pkg';

import auditLogService from '@/services/audit-log/audit-log.service';
import AuditLogsDatasource from '@/datasources/audit-logs.datasource';

class AuditLogController {
  async createLog(req: CorrelatedMessage<LogDTO>): Promise<void> {
    LogDTOSchema.parse(req.data);

    await auditLogService.createLog(req.data);
  }

  async getLogs(req: CorrelatedMessage<GetAllRestQueryParams>): Promise<GetAllRestPaginatedResponse<LogDTO>> {
    GetAllRestQueryParamsSchema.parse(req.data);

    const datasource = new AuditLogsDatasource(req.data);
    const [logs, count] = await datasource.output();

    return {
      results: logs.map((log) => log.output()),
      count,
    };
  }
}

export default new AuditLogController();
