import { BaseQueue } from '@/queues/queues/base.queue';
import { QUEUE_AUDIT_LOG } from '@/common/constants';

class AuditLogQueue extends BaseQueue {
  constructor() {
    super(QUEUE_AUDIT_LOG);
  }
}

const auditLogQueue = new AuditLogQueue();
export default auditLogQueue;
