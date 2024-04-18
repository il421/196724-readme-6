import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { DEFAULT_HOST, DEFAULT_PORT, ENVIRONMENTS } from './app.constants';
import { validateConfig } from '../utils';
import { Environment } from './environment.type';
import { Registers } from '../registers.enum';

const VALIDATION_ERROR = 'Application Config Validation Error';

export interface ApplicationConfig {
  environment: string;
  port: number;
  host: string;
}

const validationSchema = Joi.object({
  environment: Joi.string()
    .valid(...ENVIRONMENTS)
    .required(),
  port: Joi.number().port().default(DEFAULT_PORT),
  host: Joi.string().required().default(DEFAULT_HOST),
});

const getConfig = (): ApplicationConfig => {
  const config: ApplicationConfig = {
    environment: process.env['NODE_ENV'] as Environment,
    port: parseInt(process.env['PORT'] || `${DEFAULT_PORT}`, 10),
    host: process.env['HOST'],
  };

  validateConfig(validationSchema, config, VALIDATION_ERROR);
  return config;
};

export const applicationConfig = registerAs(Registers.Application, getConfig);
