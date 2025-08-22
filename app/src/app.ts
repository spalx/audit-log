import { IAppPkg, AppRunPriority } from 'app-life-cycle-pkg';
import { transportService, TransportAdapterName, CorrelatedRequestDTO } from 'transport-pkg';
import { CreateLogDTO, AuditLogAction } from 'audit-log-pkg';
import { KafkaTransportAdapter } from 'kafka-transport-adapter';
import { HTTPTransportAdapter } from 'http-transport-adapter';

import auditLogWorker from '@/queues/workers/audit-log.worker';
import CreateLogCommand from '@/commands/log/create-log.command';
import { connectToDatabase } from '@/config/db.config';
import appConfig from '@/config/app.config';

class App implements IAppPkg {
  async init(): Promise<void> {
    await connectToDatabase();

    transportService.registerTransport(TransportAdapterName.Kafka, new KafkaTransportAdapter('kafka:9092', 'audit-log'));
    transportService.registerTransport(TransportAdapterName.HTTP, new HTTPTransportAdapter(appConfig.app.port));
    transportService.transportsReceive(AuditLogAction.CreateLog, async (data: CorrelatedRequestDTO) => {
      this.createLogMessageReceived(data);
    });
  }

  async shutdown(): Promise<void> {
    await auditLogWorker.close();
  }

  getPriority(): number {
    return AppRunPriority.Low;
  }

  private async createLogMessageReceived(message: CorrelatedRequestDTO): Promise<void> {
    const createLogCmd = new CreateLogCommand();
    await createLogCmd.execute(message as CorrelatedRequestDTO<CreateLogDTO>);
  }
}

export default new App();
