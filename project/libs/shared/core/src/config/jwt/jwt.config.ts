import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { Registers } from '../registers.enum';
import { JWT_VALIDATION_ERROR, validateConfig } from '@project/core';
import { JwtConfig } from './jwt.interface';

const validationSchema = Joi.object({
  accessTokenSecret: Joi.string().required(),
  accessTokenExpiresIn: Joi.string().required(),
});

const getConfig = (): JwtConfig => {
  const config: JwtConfig = {
    accessTokenSecret: process.env['JWT_ACCESS_TOKEN_SECRET'],
    accessTokenExpiresIn: process.env['JWT_ACCESS_TOKEN_EXPIRES_IN'],
  };

  validateConfig(validationSchema, config, JWT_VALIDATION_ERROR);
  return config;
};

export const jwtConfig = registerAs(Registers.Jwt, getConfig);
