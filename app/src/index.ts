import { logger } from 'common-loggers-pkg';
import { appService } from 'app-life-cycle-pkg';
import { transportService } from 'transport-pkg';
import { serviceDiscoveryService } from 'service-discovery-pkg';

import app from './app';

async function startServer(): Promise<void> {
  try {
    logger.info('Starting audit-log service');

    appService.use(app);
    appService.use(serviceDiscoveryService);
    appService.use(transportService);

    await appService.run();

    logger.info('audit-log service running');
  } catch (error) {
    logger.error('Failed to start audit-log service', error);
    process.exit(1);
  }
}

startServer();
