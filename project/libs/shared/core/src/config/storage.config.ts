import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { Registers } from './registers.enum';
import { validateConfig } from '@project/core';

const VALIDATION_ERROR = 'Uploads Storage Validation Error';

export interface StorageConfig {
  rootPath: string;
}

const validationSchema = Joi.object({
  rootPath: Joi.string().required(),
});

const getConfig = (): StorageConfig => {
  const config: StorageConfig = {
    rootPath: process.env['STORAGE_DIRECTORY'],
  };

  validateConfig(validationSchema, config, VALIDATION_ERROR);
  return config;
};

export default registerAs(Registers.Storage, getConfig);
