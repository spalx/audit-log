import * as mongoose from 'mongoose';

interface BaseDocument extends mongoose.Document {
  created_at?: Date;
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
