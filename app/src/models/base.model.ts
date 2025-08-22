import * as mongoose from 'mongoose';

interface BaseDocument extends mongoose.Document {
  created_at?: Date;
  updated_at?: Date;
  is_deleted?: boolean;
  meta?: Record<string, unknown>;
}

class BaseModel {
  schema: mongoose.Schema;

  constructor() {
    this.schema = new mongoose.Schema(
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          default: () => new mongoose.Types.ObjectId(),
        },

        created_at: {
          type: Date,
          default: Date.now,
        },

        updated_at: {
          type: Date,
          default: Date.now,
        },

        is_deleted: {
          type: Boolean,
          default: false,
        },

        meta: {
          type: Object,
          default: {},
        },
      },
      {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
      }
    );

    this.schema.pre<mongoose.Query<BaseDocument, BaseDocument>>('updateOne', function (next) {
      this.set({ updated_at: new Date() });
      next();
    });

    this.schema.pre<BaseDocument>('save', function (next) {
      this.updated_at = new Date();
      next();
    });

    this.schema.set('toJSON', {
      getters: true,
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.id;
      },
    });
  }

  getModel<T extends mongoose.Document>(name: string): mongoose.Model<T> {
    return mongoose.model<T>(name, this.schema);
  }
}

export { BaseDocument, BaseModel };
export default BaseModel;
