export interface IAppConfig {
  app: {
    port: number;
  };
  bullDb: {
    host: string;
    port: number;
  };
  db: {
    uri: string;
  };
}
