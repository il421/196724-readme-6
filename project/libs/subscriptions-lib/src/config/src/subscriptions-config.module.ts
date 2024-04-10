import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import applicationConfig from '../../../../shared/core/src/config/app.config';
const ENV_SUBSCRIPTIONS_FILE_PATH = 'apps/subscriptions/.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [applicationConfig],
      envFilePath: ENV_SUBSCRIPTIONS_FILE_PATH,
    }),
  ],
})
export class SubscriptionsConfigModule {}
