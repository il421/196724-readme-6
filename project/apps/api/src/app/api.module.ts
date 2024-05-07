import { Module } from '@nestjs/common';
import { ApiConfigModule } from './config';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { getHttpClientOptions } from '@project/core';
import { UsersController } from './controllers';

@Module({
  imports: [
    ApiConfigModule,
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: getHttpClientOptions,
    }),
  ],
  controllers: [UsersController],
  providers: [],
})
export class ApiModule {}
