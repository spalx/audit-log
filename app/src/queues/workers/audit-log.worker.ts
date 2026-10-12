import { Job } from 'bullmq';
import { CorrelatedMessage } from '@spalx/transport-pkg';
import { LogDTO } from '@spalx/audit-log-pkg';
import { BaseWorker } from './base.worker';
import { QUEUE_AUDIT_LOG, AuditLogJobName } from '@/common/constants';
import auditLogController from '@/controllers/audit-log.controller';

const jobHandlers: Record<string, (job: Job) => Promise<void>> = {
  [AuditLogJobName.CreateLog]: async (job: Job) => {
    const data = job.data as CorrelatedMessage<LogDTO>;
    await auditLogController.createLog(data);
  },
};

class AuditLogWorker extends BaseWorker {
  constructor() {
    super(QUEUE_AUDIT_LOG, jobHandlers, { concurrency: 4 });
  }
}

const auditLogWorker = new AuditLogWorker();
export default auditLogWorker;
