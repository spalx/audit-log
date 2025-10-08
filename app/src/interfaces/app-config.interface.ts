export interface IAppConfig {
  app: {
    port: number;
    host: string;
  };
  bullDb: {
    host: string;
    port: number;
  };
  db: {
    user: string;
    password: string;
    host: string;
    name: string;
  };
}
