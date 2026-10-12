import { IAppPkg, AppRunPriority } from '@spalx/app-life-cycle-pkg';
import { transportService, TransportAdapterName, CorrelatedMessage } from '@spalx/transport-pkg';
import { AuditLogAction, SERVICE_NAME } from '@spalx/audit-log-pkg';
import { HTTPTransportAdapter } from '@spalx/http-transport-adapter';
import { serviceDiscoveryService } from '@spalx/service-discovery-pkg';

import auditLogWorker from '@/queues/workers/audit-log.worker';
import auditLogQueue from '@/queues/queues/audit-log.queue';

import BaseCommand from '@/commands/base.command';
import CreateLogCommand from '@/commands/log/create-log.command';
import GetLogsCommand from '@/commands/log/get-logs.command';
import appDataSource from '@/common/db/app-data-source';
import appConfig from '@/config/app.config';
import { logger } from '@spalx/common-loggers-pkg';

class App implements IAppPkg {
  private httpTransportAdapter: HTTPTransportAdapter;

  private queues = [auditLogQueue];

  private workers = [auditLogWorker];

  constructor() {
    this.httpTransportAdapter = new HTTPTransportAdapter(appConfig.app.port);

    transportService.registerTransport(TransportAdapterName.HTTP, this.httpTransportAdapter);

    this.setActionHandlers();
  }

  async init(): Promise<void> {
    await appDataSource.initialize();
    await appDataSource.runMigrations();

    this.queues.forEach((manager) => manager.initialize());
    logger.info('All queues initialized successfully');

    this.workers.forEach((manager) => manager.initialize());
    logger.info('All workers started polling safely');

    // Make service discoverable by other services
    await serviceDiscoveryService.registerService({
      service_name: SERVICE_NAME,
      host: appConfig.app.host,
      port: appConfig.app.port,
    });
  }

  async shutdown(): Promise<void> {
    await serviceDiscoveryService.deregisterService(appConfig.app.host);

    for (const worker of this.workers) {
      await worker.close();
    }

    await appDataSource.destroy();
  }

  getPriority(): number {
    return AppRunPriority.High;
  }

  getName(): string {
    return 'audit-log';
  }

  getDependencies(): IAppPkg[] {
    return [transportService, this.httpTransportAdapter, serviceDiscoveryService];
  }

  private setActionHandlers() {
    this.setActionHandler(AuditLogAction.CreateLog, new CreateLogCommand(), false);
    this.setActionHandler(AuditLogAction.GetLogs, new GetLogsCommand());
  }

  private setActionHandler(action: string, cmd: BaseCommand, returns = true): void {
    transportService.setActionHandler(action, async (req: CorrelatedMessage) => {
      const res = await cmd.execute(req);
      return returns ? (res as object) : {};
    });
  }
}

export default new App();
