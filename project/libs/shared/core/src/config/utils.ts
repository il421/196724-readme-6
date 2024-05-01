import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import {
  getMongoConnectionString,
  getRabbitMQConnectionString,
} from '@project/helpers';
import { ServeStaticModuleAsyncOptions } from '@nestjs/serve-static';
import { ObjectSchema } from 'joi';
import { resolve } from 'node:path';
import { JwtModuleOptions } from '@nestjs/jwt';
import { AsyncModuleConfig } from '@golevelup/nestjs-modules';
import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface'; // @TODO
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'; // @TODO

export const getMongooseOptions = (): MongooseModuleAsyncOptions => {
  return {
    useFactory: async (config: ConfigService) => {
      return {
        uri: getMongoConnectionString({
          username: config.get<string>('mongo.user'),
          password: config.get<string>('mongo.password'),
          host: config.get<string>('mongo.host'),
          port: config.get<string>('mongo.port'),
          authDatabase: config.get<string>('mongo.authBase'),
          databaseName: config.get<string>('mongo.name'),
        }),
      };
    },
    inject: [ConfigService],
  };
};

export const getStaticStorageOptions = (): ServeStaticModuleAsyncOptions => {
  return {
    useFactory: async (config: ConfigService) => {
      return [
        {
          rootPath: resolve(config.get('storage.rootPath')),
          serveRoot: config.get('storage.serveRoot'),
          serveStaticOptions: {
            fallthrough: true,
            etag: true,
          },
        },
      ];
    },
    inject: [ConfigService],
  };
};

export async function getJwtOptions(
  configService: ConfigService
): Promise<JwtModuleOptions> {
  return {
    secret: configService.get<string>('jwt.accessTokenSecret'),
    signOptions: {
      expiresIn: configService.get<string>('jwt.accessTokenExpiresIn'),
      algorithm: 'HS256',
    },
  };
}

export const getRabbitMQOptions = (): AsyncModuleConfig<any> => {
  return {
    useFactory: async (config: ConfigService) => ({
      exchanges: [
        {
          name: config.get<string>('rabbit.exchange'),
          type: 'direct',
        },
      ],
      uri: getRabbitMQConnectionString({
        host: config.get<string>('rabbit.host'),
        password: config.get<string>('rabbit.password'),
        user: config.get<string>('rabbit.user'),
        port: config.get<string>('rabbit.port'),
      }),
      connectionInitOptions: { wait: true },
      enableControllerDiscovery: true,
    }),
    inject: [ConfigService],
  };
};

export const validateConfig = (
  schema: ObjectSchema,
  config: object,
  message: string
): void => {
  const { error } = schema.validate(config, { abortEarly: true });
  if (error) {
    throw new Error(`[${message}]: ${error.message}`);
  }
};

export function getMailerAsyncOptions(): MailerAsyncOptions {
  return {
    useFactory: async (configService: ConfigService) => {
      return {
        transport: {
          host: configService.get<string>('mail.host'),
          port: configService.get<number>('mail.port'),
          secure: false,
          auth: {
            user: configService.get<string>('mail.user'),
            pass: configService.get<string>('mail.password'),
          },
        },
        defaults: {
          from: configService.get<string>('mail.from'),
        },
        template: {
          dir: resolve(__dirname, 'assets'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      };
    },
    inject: [ConfigService],
  };
}
