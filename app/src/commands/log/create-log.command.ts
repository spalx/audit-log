import { LogDTO } from '@spalx/audit-log-pkg';
import { CorrelatedMessage } from '@spalx/transport-pkg';

import BaseCommand from '@/commands/base.command';
import auditLogQueue from '@/queues/queues/audit-log.queue';
import { AuditLogJobName, QueueJobPriority } from '@/common/constants';

export default class CreateLogCommand extends BaseCommand {
  async execute(req: CorrelatedMessage<LogDTO>): Promise<void> {
    await auditLogQueue.add(AuditLogJobName.CreateLog, req, {
      jobId: req.id,
      priority: QueueJobPriority.Critical,
    });
  }
}
