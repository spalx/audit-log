import { LogDTO } from 'audit-log-pkg';
import { GetAllRestQueryParams, GetAllRestPaginatedResponse } from 'rest-pkg';
import { CorrelatedMessage } from 'transport-pkg';

import BaseCommand from '@/commands/base.command';
import auditLogController from '@/controllers/audit-log.controller';

export default class GetLogsCommand extends BaseCommand {
  async execute(req: CorrelatedMessage<GetAllRestQueryParams>): Promise<GetAllRestPaginatedResponse<LogDTO>> {
    return await auditLogController.getLogs(req);
  }
}
