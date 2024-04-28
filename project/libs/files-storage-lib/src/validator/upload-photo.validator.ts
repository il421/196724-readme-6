import * as Joi from 'joi';

import {
  FILE_FORMATS,
  MAX_AVATAR_SIZE_KB,
  MAX_PHOTO_SIZE_KB,
} from './file.constraints';

export const UploadPhotoValidator = Joi.object<Express.Multer.File>({
  size: Joi.number().max(MAX_PHOTO_SIZE_KB),
  mimetype: Joi.string().valid(...FILE_FORMATS),
}).options({
  abortEarly: false,
  allowUnknown: true,
});
