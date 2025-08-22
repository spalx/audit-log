import { BaseDocument, BaseModel } from '@/models/base.model';

interface AuditLogAuthor {
  id: string;
  name: string;
}

interface AuditLogDocument extends BaseDocument {
  client: string;
  author: AuditLogAuthor;
  action: string;
  date?: Date;
}

class AuditLogModel extends BaseModel {
  constructor() {
    super();

    this.schema.add({
      client: {
        type: String,
        required: true,
      },

      author: {
        type: Object,
        required: true,
      },

      action: {
        type: String,
        required: true,
      },

      date: {
        type: Date,
        default: Date.now,
      },
    });

    this.schema.set('collection', 'audit-logs');
  }

  static outputDocument(doc: AuditLogDocument): AuditLogDocument {
    const obj = doc.toObject();

    const { _id, is_deleted: _, __v, created_at: __, updated_at: ___, ...newDoc } = obj;

    return newDoc;
  }
}

const AuditLog = new AuditLogModel().getModel<AuditLogDocument>('AuditLog');
export { AuditLog, AuditLogDocument, AuditLogModel };
export default AuditLog;
