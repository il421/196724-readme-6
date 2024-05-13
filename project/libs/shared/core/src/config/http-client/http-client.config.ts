import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { Registers } from '../registers.enum';
import { validateConfig } from '@project/core';
import { IHttpClientConfig } from './http-client.interface';
import { HTTP_CLIENT_VALIDATION_ERROR } from './http-client.constants';
import { PARSE_INT_RADIX } from '@project/helpers';
import { getServiceUrl } from './utils';
import * as process from 'process';
import {
  AUTHENTICATION_PATHS,
  FEEDBACK_PATHS,
  FILES_STORAGE_PATHS,
  POST_PATHS,
  SUBSCRIPTIONS_PATHS,
  USERS_PATHS,
} from '@project/data-access';

const validationSchema = Joi.object({
  maxRedirect: Joi.number().required(),
  timeout: Joi.number().required(),
  serviceUrls: Joi.object({
    auth: Joi.string().required(),
    users: Joi.string().required(),
    posts: Joi.string().required(),
    subscriptions: Joi.string().required(),
    feedback: Joi.string().required(),
    filesStorage: Joi.string().required(),
  }),
});

const getConfig = (): IHttpClientConfig => {
  const config: IHttpClientConfig = {
    maxRedirect: parseInt(
      process.env['HTTP_CLIENT_MAX_REDIRECTS'],
      PARSE_INT_RADIX
    ),
    timeout: parseInt(process.env['HTTP_CLIENT_TIMEOUT'], PARSE_INT_RADIX),
    serviceUrls: {
      auth: getServiceUrl(
        process.env['HOST'],
        process.env['AUTH_PORT'],
        AUTHENTICATION_PATHS.BASE
      ),
      users: getServiceUrl(
        process.env['HOST'],
        process.env['USERS_PORT'],
        USERS_PATHS.BASE
      ),
      posts: getServiceUrl(
        process.env['HOST'],
        process.env['POSTS_PORT'],
        POST_PATHS.BASE
      ),
      subscriptions: getServiceUrl(
        process.env['HOST'],
        process.env['SUBSCRIPTIONS_PORT'],
        SUBSCRIPTIONS_PATHS.BASE
      ),
      feedback: getServiceUrl(
        process.env['HOST'],
        process.env['FEEDBACK_PORT'],
        FEEDBACK_PATHS.BASE
      ),
      filesStorage: getServiceUrl(
        process.env['HOST'],
        process.env['FILES_STORAGE_PORT'],
        FILES_STORAGE_PATHS.BASE
      ),
    },
  };

  validateConfig(validationSchema, config, HTTP_CLIENT_VALIDATION_ERROR);
  return config;
};

export const httpClientConfig = registerAs(Registers.HttpClient, getConfig);
