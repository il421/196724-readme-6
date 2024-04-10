import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { APP_VERSION, GLOBAL_PREFIX } from '@project/core';
import { INestApplication } from '@nestjs/common';

export const buildSwagger = (app: INestApplication, appName: string) => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle(`${appName} API`)
    .setVersion(APP_VERSION)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(GLOBAL_PREFIX, app, document);
};
