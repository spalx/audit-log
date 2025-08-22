import mongoose from 'mongoose';

import appConfig from '@/config/app.config';

export async function connectToDatabase(): Promise<void> {
  await mongoose.connect(appConfig.db.uri);
};

export const bullDbConnection = {
  host: appConfig.bullDb.host,
  port: appConfig.bullDb.port,
};
