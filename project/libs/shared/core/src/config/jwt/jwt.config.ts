import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { Registers } from '../registers.enum';
import { JWT_VALIDATION_ERROR, validateConfig } from '@project/core';
import { IJwtConfig } from './jwt.interface';

const validationSchema = Joi.object({
  accessTokenSecret: Joi.string().required(),
  accessTokenExpiresIn: Joi.string().required(),
  refreshTokenSecret: Joi.string().required(),
  refreshTokenExpiresIn: Joi.string().required(),
});

const getConfig = (): IJwtConfig => {
  const config: IJwtConfig = {
    accessTokenSecret: process.env['JWT_ACCESS_TOKEN_SECRET'],
    accessTokenExpiresIn: process.env['JWT_ACCESS_TOKEN_EXPIRES_IN'],
    refreshTokenSecret: process.env['JWT_REFRESH_TOKEN_SECRET'],
    refreshTokenExpiresIn: process.env['JWT_REFRESH_TOKEN_EXPIRES_IN'],
  };

  validateConfig(validationSchema, config, JWT_VALIDATION_ERROR);
  return config;
};

export const jwtConfig = registerAs(Registers.Jwt, getConfig);
