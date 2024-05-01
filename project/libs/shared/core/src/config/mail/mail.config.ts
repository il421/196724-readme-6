import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { Registers } from '../registers.enum';
import { validateConfig } from '../utils';
import { MAIL_VALIDATION_ERROR } from './mail.constants';

export interface MailConfig {
  host: string;
  password: string;
  user: string;
  from: string;
  port: number;
}

const validationSchema = Joi.object({
  host: Joi.string().valid().hostname().required(),
  password: Joi.string().required(),
  port: Joi.number().port(),
  user: Joi.string().required(),
  from: Joi.string().required(),
});

function getConfig(): MailConfig {
  const config: MailConfig = {
    host: process.env.MAIL_SMTP_HOST,
    port: parseInt(process.env.MAIL_SMTP_PORT),
    user: process.env.MAIL_USER_NAME,
    password: process.env.MAIL_USER_PASSWORD,
    from: process.env.MAIL_FROM,
  };

  validateConfig(validationSchema, config, MAIL_VALIDATION_ERROR);
  return config;
}

export const mailConfig = registerAs(Registers.Mail, getConfig);
