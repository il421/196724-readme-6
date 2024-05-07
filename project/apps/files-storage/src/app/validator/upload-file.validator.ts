import * as Joi from 'joi';

import {
  FILE_FORMATS,
  MAX_AVATAR_SIZE,
  MAX_PHOTO_SIZE,
} from './file.constraints';
import { FilesTypes } from '@project/core';

export const UploadFileValidator = Joi.object<Express.Multer.File>({
  size: Joi.when('type', [
    {
      is: FilesTypes.Avatar,
      then: Joi.number().max(MAX_AVATAR_SIZE),
      otherwise: Joi.number().max(MAX_PHOTO_SIZE),
    },
  ]),
  mimetype: Joi.string().valid(...FILE_FORMATS),
}).options({
  abortEarly: false,
  allowUnknown: true,
});
