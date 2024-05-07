import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { Registers } from '../registers.enum';
import { validateConfig } from '../utils';
import { RABBIT_VALIDATION_ERROR } from './rebbit.constants';
import { PARSE_INT_RADIX } from '@project/helpers';

export interface RabbitConfig {
  host: string;
  password: string;
  user: string;
  queue: string;
  exchange: string;
  port: number;
}

const validationSchema = Joi.object({
  host: Joi.string().valid().hostname().required(),
  password: Joi.string().required(),
  port: Joi.number().port(),
  user: Joi.string().required(),
  queue: Joi.string().required(),
  exchange: Joi.string().required(),
});

function getConfig(): RabbitConfig {
  const config: RabbitConfig = {
    host: process.env.RABBIT_HOST,
    password: process.env.RABBIT_PASSWORD,
    port: parseInt(process.env.RABBIT_PORT, PARSE_INT_RADIX),
    user: process.env.RABBIT_USER,
    queue: process.env.RABBIT_QUEUE,
    exchange: process.env.RABBIT_EXCHANGE,
  };

  validateConfig(validationSchema, config, RABBIT_VALIDATION_ERROR);
  return config;
}

export const rabbitConfig = registerAs(Registers.Rabbit, getConfig);
