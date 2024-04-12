import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { validateConfig } from './utils';
import { DEFAULT_MONGO_PORT, DEFAULT_MONGO_UI_PORT } from './config.constants';
import { Registers } from './registers.enum';

const VALIDATION_ERROR = 'DB Config Validation Error';
export interface MongoConfig {
  host: string;
  name: string;
  port: number;
  uiPort: number;
  user: string;
  password: string;
  authBase: string;
}

const dbValidationSchema = Joi.object({
  host: Joi.string().hostname().required(),
  port: Joi.number().port().default(DEFAULT_MONGO_PORT),
  uiPort: Joi.number().port().default(DEFAULT_MONGO_UI_PORT),
  name: Joi.string().required(),
  user: Joi.string().required(),
  password: Joi.string().required(),
  authBase: Joi.string().required(),
});

const getDbConfig = (): MongoConfig => {
  const config: MongoConfig = {
    host: process.env['MONGO_HOST'] ?? '',
    name: process.env['MONGO_DB'] ?? '',
    port: parseInt(process.env['MONGO_PORT'] ?? `${DEFAULT_MONGO_PORT}`, 10),
    uiPort: parseInt(
      process.env['MONGO_UI_PORT'] ?? `${DEFAULT_MONGO_UI_PORT}`,
      10
    ),
    user: process.env['MONGO_USER'] ?? '',
    password: process.env['MONGO_PASSWORD'] ?? '',
    authBase: process.env['MONGO_AUTH_BASE'] ?? '',
  };

  validateConfig(dbValidationSchema, config, VALIDATION_ERROR);
  return config;
};

export default registerAs(Registers.Mongo, getDbConfig);
