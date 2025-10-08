import { IAppPkg, AppRunPriority } from 'app-life-cycle-pkg';
import { transportService, TransportAdapterName, CorrelatedMessage } from 'transport-pkg';
import { LogDTO, AuditLogAction, SERVICE_NAME } from 'audit-log-pkg';
import { HTTPTransportAdapter } from 'http-transport-adapter';
import { serviceDiscoveryService } from 'service-discovery-pkg';

import auditLogWorker from '@/queues/workers/audit-log.worker';
import BaseCommand from '@/commands/base.command';
import CreateLogCommand from '@/commands/log/create-log.command';
import GetLogsCommand from '@/commands/log/get-logs.command';
import appDataSource from '@/config/db.config';
import appConfig from '@/config/app.config';

class App implements IAppPkg {
  private httpTransportAdapter: HTTPTransportAdapter;

  constructor() {
    this.httpTransportAdapter = new HTTPTransportAdapter(appConfig.app.port);

    transportService.registerTransport(TransportAdapterName.HTTP, this.httpTransportAdapter);

    this.setActionHandlers();
  }

  async init(): Promise<void> {
    await appDataSource.initialize();

    // Make service discoverable by other services
    await serviceDiscoveryService.registerService({
      service_name: SERVICE_NAME,
      host: appConfig.app.host,
      port: appConfig.app.port,
    });
  }

  async shutdown(): Promise<void> {
    await serviceDiscoveryService.deregisterService(appConfig.app.host);
    await auditLogWorker.close();
    await appDataSource.destroy();
  }

  getPriority(): number {
    return AppRunPriority.High;
  }

  getName(): string {
    return 'audit-log';
  }

  getDependencies(): IAppPkg[] {
    return [
      transportService,
      this.httpTransportAdapter,
      serviceDiscoveryService
    ];
  }

  private setActionHandlers() {
    this.setActionHandler(AuditLogAction.CreateLog, new CreateLogCommand(), false);
    this.setActionHandler(AuditLogAction.GetLogs, new GetLogsCommand());
  }

  private setActionHandler(action: string, cmd: BaseCommand, returns = true): void {
    transportService.setActionHandler(action, async (req: CorrelatedMessage) => {
      const res = await cmd.execute(req);
      return returns ? res as object : {};
    });
  }
}

export default new App();
