import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { FeedbackRepository } from './feedback.repository';
import { FeedbackFactory } from './feedback.factory';
import { PrismaClientModule } from '@project/prisma-client';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getJwtOptions } from '@project/core';
import { JwtAccessStrategy } from '@project/data-access';
import { FeedbackConfigModule } from './config';

@Module({
  imports: [
    FeedbackConfigModule,
    PrismaClientModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: getJwtOptions,
    }),
  ],
  controllers: [FeedbackController],
  providers: [
    FeedbackService,
    FeedbackRepository,
    FeedbackFactory,
    JwtAccessStrategy,
  ],
})
export class FeedbackModule {}
