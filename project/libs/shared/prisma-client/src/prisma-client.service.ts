import { PrismaClient } from '@prisma/client';
import { OnModuleInit, OnModuleDestroy, Injectable } from '@nestjs/common';

@Injectable()
export class PrismaClientService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this['$connect']();
  }

  async onModuleDestroy() {
    await this['$disconnect']();
  }
}
