import { Worker, Job } from 'bullmq';
import { CorrelatedMessage } from 'transport-pkg';
import { LogDTO } from 'audit-log-pkg';
import { logger } from 'common-loggers-pkg';

import { bullDbConnection } from '@/config/db.config';
import { QUEUE_AUDIT_LOG, AuditLogJobName } from '@/common/constants';
import auditLogController from '@/controllers/audit-log.controller';

const jobHandlers: Record<string, (req: CorrelatedMessage<LogDTO>) => Promise<void>> = {
  [AuditLogJobName.CreateLog]: auditLogController.createLog.bind(auditLogController),
};

const auditLogWorker = new Worker(
  QUEUE_AUDIT_LOG,
  async (job: Job) => {
    const handler = jobHandlers[job.name];
    if (handler) {
      await handler(job.data);
    } else {
      logger.error(`No handler found for audit log job: ${job.name}`);
    }
  },
  {
    connection: bullDbConnection,
    concurrency: 4,
  }
);

auditLogWorker.on('failed', (job?: Job, error?: Error) => {
  logger.error(`Audit log job ${job?.name} with data ${JSON.stringify(job?.data)} failed:`, error);
});

export default auditLogWorker;
