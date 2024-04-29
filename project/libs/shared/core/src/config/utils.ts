import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { getMongoConnectionString } from '@project/helpers';
import { ServeStaticModuleAsyncOptions } from '@nestjs/serve-static/dist/interfaces/serve-static-options.interface';
import { ObjectSchema } from 'joi';
import { resolve } from 'node:path';
import { JwtModuleOptions } from '@nestjs/jwt';
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
