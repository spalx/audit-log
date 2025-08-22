import { z } from 'zod';

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

const AuditLogAuthorSchema = z.object({
  id: z
    .string({
      required_error: 'id is required',
      invalid_type_error: 'id must be a string',
    })
    .min(1, 'id cannot be empty'),
  name: z
    .string({
      required_error: 'name is required',
      invalid_type_error: 'name must be a string',
    })
    .min(1, 'name cannot be empty'),
});

export const CreateLogDTOSchema = z.object({
  client: z
    .string({
      required_error: 'client is required',
      invalid_type_error: 'client must be a string',
    })
    .min(1, 'client cannot be empty'),

  author: AuditLogAuthorSchema,

  action: z
    .string({
      required_error: 'action is required',
      invalid_type_error: 'action must be a string',
    })
    .min(1, 'action cannot be empty'),

  date: z
    .string({
      invalid_type_error: 'date must be a string',
    })
    .min(1, 'date cannot be empty')
    .optional(),

  meta: z
    .record(z.unknown(), {
      invalid_type_error: 'meta must be an object with string keys',
    })
    .optional()
});
