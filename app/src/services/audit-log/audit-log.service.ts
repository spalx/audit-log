import { LogDTO } from '@spalx/audit-log-pkg';

import AuditLogEntity from '@/entities/audit-log/audit-log.entity';
import appDataSource from '@/common/db/app-data-source';
import AuditLogTokenEntity from '@/entities/audit-log-token/audit-log-token.entity';

class AuditLogService {
  private get auditLogRepository() {
    return appDataSource.getRepository(AuditLogEntity);
  }

  async createLog(data: LogDTO): Promise<void> {
    await appDataSource.transaction(async (transactionalEntityManager) => {
      const auditLog = new AuditLogEntity();

      auditLog.author = data.author;
      auditLog.action = data.action;

      if (data.target_id) {
        auditLog.target_id = data.target_id;
      }

      if (data.date) {
        auditLog.date = data.date;
      }

      if (data.meta) {
        auditLog.meta = data.meta;
      }

      const savedLog = await transactionalEntityManager.save(AuditLogEntity, auditLog);

      const isTokens = data?.tokens && data?.tokens?.length > 0;

      if (isTokens) {
        const tokensToInsert = data.tokens.map((token) => ({
          logId: savedLog.id,
          tokenValue: token,
        }));

        await transactionalEntityManager
          .createQueryBuilder()
          .insert()
          .into(AuditLogTokenEntity)
          .values(tokensToInsert)
          .orIgnore()
          .execute();
      }
    });
  }
}

export default new AuditLogService();
