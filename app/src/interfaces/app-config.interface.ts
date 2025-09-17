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
    uri: string;
  };
}
