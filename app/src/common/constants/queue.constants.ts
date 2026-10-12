export const QUEUE_AUDIT_LOG = 'AuditLog';

export enum AuditLogJobName {
  CreateLog = 'CreateLog',
}

export enum QueueJobPriority {
  Critical = 1,
  High = 5,
  Normal = 10,
  Low = 20,
}
