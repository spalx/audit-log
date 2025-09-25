import { LogDTO } from 'audit-log-pkg';

import { BaseDocument, BaseModel } from '@/models/base.model';

interface AuditLogAuthor {
  id: string;
  name: string;
}

interface AuditLogDocument extends BaseDocument {
  author: AuditLogAuthor;
  action: string;
  target_id?: string;
  date?: Date;
}

class AuditLogModel extends BaseModel {
  constructor() {
    super();

    this.schema.add({
      author: {
        type: Object,
        required: true,
      },

      action: {
        type: String,
        required: true,
      },

      target_id: {
        type: String,
      },

      date: {
        type: Date,
        default: Date.now,
      },
    });

    // Compound index: action + target_id + author.id
    // Efficient for:
    // - Queries filtering by action
    // - Queries filtering by action + target_id
    // - Queries filtering by action + target_id + author.id
    this.schema.index({ action: 1, target_id: 1, 'author.id': 1 });

    // Single-field index on target_id
    // Efficient for queries filtering only by target_id
    this.schema.index({ target_id: 1 });

    // Single-field index on author.id
    // Efficient for queries filtering only by author.id
    this.schema.index({ 'author.id': 1 });

    // Compound index: action + author.id
    // Efficient for:
    // - Queries filtering by action
    // - Queries filtering by action + author.id
    this.schema.index({ action: 1, 'author.id': 1 });

    this.schema.set('collection', 'audit-logs');
  }

  static outputDocument(doc: AuditLogDocument): LogDTO {
    const obj = doc.toObject();

    const { _id, id, __v, created_at: __, ...newDoc } = obj;

    return newDoc;
  }
}

const AuditLog = new AuditLogModel().getModel<AuditLogDocument>('AuditLog');
export { AuditLog, AuditLogDocument, AuditLogModel };
export default AuditLog;
