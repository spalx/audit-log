import { CreateLogDTO } from 'audit-log-pkg';
import { CorrelatedMessage } from 'transport-pkg';

import BaseCommand from '@/commands/base.command';
import auditLogQueue from '@/queues/queues/audit-log.queue';
import { AuditLogJobName, QueueJobPriority } from '@/common/constants';

export default class CreateLogCommand extends BaseCommand {
  async execute(req: CorrelatedMessage<CreateLogDTO>): Promise<void> {
    await auditLogQueue.add(AuditLogJobName.CreateLog, req, {
      jobId: req.id,
      priority: QueueJobPriority.Critical,
    });
  }
}
