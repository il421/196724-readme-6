import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { getMongoConnectionString } from '@project/helpers';
import { ServeStaticModuleAsyncOptions } from '@nestjs/serve-static/dist/interfaces/serve-static-options.interface';
import { ObjectSchema } from 'joi';
import { join } from 'node:path';

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
    useFactory: async (config: ConfigService) => [
      {
        rootPath: join(__dirname, '..', config.get('storage.rootPath')),
      },
    ],
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
