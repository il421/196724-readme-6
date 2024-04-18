import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { validateConfig } from '../utils';
import { Registers } from '../registers.enum';
import { MongoConfig } from './mongo.interface';
import { MONGO_VALIDATION_ERROR } from './mongo.constants';

const dbValidationSchema = Joi.object({
  host: Joi.string().hostname().required(),
  port: Joi.number().port(),
  name: Joi.string().required(),
  user: Joi.string().required(),
  password: Joi.string().required(),
  authBase: Joi.string().required(),
});

const getDbConfig = (): MongoConfig => {
  const config: MongoConfig = {
    host: process.env['MONGO_HOST'] ?? '',
    name: process.env['MONGO_DB'] ?? '',
    port: parseInt(process.env['MONGO_PORT'], 10),
    user: process.env['MONGO_USER'] ?? '',
    password: process.env['MONGO_PASSWORD'] ?? '',
    authBase: process.env['MONGO_AUTH_BASE'] ?? '',
  };

  validateConfig(dbValidationSchema, config, MONGO_VALIDATION_ERROR);
  return config;
};

export const mongoConfig = registerAs(Registers.Mongo, getDbConfig);
