import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { Registers } from '../registers.enum';
import { validateConfig } from '@project/core';
import { StorageConfig } from './storage.interface';
import { STORAGE_VALIDATION_ERROR } from './storage.constants';

const validationSchema = Joi.object({
  rootPath: Joi.string().required(),
});

const getConfig = (): StorageConfig => {
  const config: StorageConfig = {
    rootPath: process.env['STORAGE_DIRECTORY'],
  };

  validateConfig(validationSchema, config, STORAGE_VALIDATION_ERROR);
  return config;
};

export const storageConfig = registerAs(Registers.Storage, getConfig);
