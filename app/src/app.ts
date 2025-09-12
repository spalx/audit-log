import { IAppPkg, AppRunPriority } from 'app-life-cycle-pkg';
import { transportService, TransportAdapterName, CorrelatedMessage } from 'transport-pkg';
import { CreateLogDTO, AuditLogAction } from 'audit-log-pkg';
import { HTTPTransportAdapter } from 'http-transport-adapter';

import auditLogWorker from '@/queues/workers/audit-log.worker';
import CreateLogCommand from '@/commands/log/create-log.command';
import { connectToDatabase } from '@/config/db.config';
import appConfig from '@/config/app.config';

class App implements IAppPkg {
  async init(): Promise<void> {
    await connectToDatabase();

    transportService.registerTransport(TransportAdapterName.HTTP, new HTTPTransportAdapter(appConfig.app.port));

    transportService.setActionHandler(AuditLogAction.CreateLog, async (req: CorrelatedMessage) => {
      const createLogCmd = new CreateLogCommand();
      await createLogCmd.execute(req as CorrelatedMessage<CreateLogDTO>);

      return {};
    });
  }

  async shutdown(): Promise<void> {
    await auditLogWorker.close();
  }

  getPriority(): number {
    return AppRunPriority.Low;
  }
}

export default new App();
