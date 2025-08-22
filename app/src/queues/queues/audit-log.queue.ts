import { Queue } from 'bullmq';

import { bullDbConnection } from '@/config/db.config';
import { QUEUE_AUDIT_LOG } from '@/common/constants';

const auditLogQueue = new Queue(QUEUE_AUDIT_LOG, {
  connection: bullDbConnection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: true,
  },
});

export default auditLogQueue;
