import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { validateConfig } from '../utils';
import { Environments } from './environments.enum';
import { Registers } from '../registers.enum';

const VALIDATION_ERROR = 'Application Config Validation Error';

export interface ApplicationConfig {
  environment: string;
  port: number;
  host: string;
}

const validationSchema = Joi.object({
  environment: Joi.string()
    .valid(...Object.values(Environments))
    .required(),
  port: Joi.number().port(),
  host: Joi.string().required(),
});

const getConfig = (): ApplicationConfig => {
  const config: ApplicationConfig = {
    environment: process.env['NODE_ENV'] as Environments,
    port: parseInt(process.env['PORT'], 10),
    host: process.env['HOST'],
  };

  validateConfig(validationSchema, config, VALIDATION_ERROR);
  return config;
};

export const applicationConfig = registerAs(Registers.Application, getConfig);
