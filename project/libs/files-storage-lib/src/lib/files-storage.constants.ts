export const FIELD_NAME = 'file';
export const MIME_TYPE = 'multipart/form-data';
export const FILE_SWAGGER_SCHEMA = {
  type: 'object',
  properties: {
    file: {
      type: 'string',
      format: 'binary',
    },
  },
};
