import { IAppConfig } from '@/interfaces/app-config.interface';

const appConfig: IAppConfig = {
  app: {
    port: Number(process.env.PORT),
    host: process.env.HOST || 'audit-log',
  },
  bullDb: {
    host: process.env.BULL_DB_HOST || 'audit-log-bull-db',
    port: Number(process.env.BULL_DB_PORT),
  },
  db: {
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || '',
    name: process.env.DB_NAME || '',
  },
};

export default Object.freeze(appConfig);
