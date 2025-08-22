import { CreateLogDTO } from 'audit-log-pkg';
import { CorrelatedRequestDTO } from 'transport-pkg';

import BaseCommand from '@/commands/base.command';
import auditLogQueue from '@/queues/queues/audit-log.queue';
import { AuditLogJobName, QueueJobPriority } from '@/common/constants';

export default class CreateLogCommand extends BaseCommand {
  async execute(requestData: CorrelatedRequestDTO<CreateLogDTO>): Promise<void> {
    await auditLogQueue.add(AuditLogJobName.CreateLog, requestData, {
      jobId: requestData.request_id,
      priority: QueueJobPriority.Critical,
    });
  }
}
