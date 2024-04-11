import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import applicationConfig from '../../../../shared/core/src/config/app.config';
const ENV_FEEDBACK_FILE_PATH = 'apps/posts/.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [applicationConfig],
      envFilePath: ENV_FEEDBACK_FILE_PATH,
    }),
  ],
})
export class PostsConfigModule {}
