export const FILES_STORAGE_PATHS = {
  BASE: 'files',
  UPLOAD: 'upload',
  FILE: ':id',
  DELETE: ':id/delete',
} as const;

export const FIELD_NAME = 'file';
export const MIME_TYPE = 'multipart/form-data';
export const FileSwaggerSchema = {
  type: 'object',
  properties: {
    file: {
      type: 'string',
      format: 'binary',
    },
  },
};

export const AVATAR_SUB_DIRECTORY = 'avatars';
export const PHOTO_SUB_DIRECTORY = 'photos';
