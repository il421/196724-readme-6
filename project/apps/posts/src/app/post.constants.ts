import { ParseArrayOptions } from '@nestjs/common';

export const DEFAULT_NUMBER_OF_POSTS = 25;

export const PARSE_QUERY_ARRAY_PIPE_OPTIONS: ParseArrayOptions = {
  items: String,
  separator: ',',
  optional: true,
};

export const POST_PATHS = {
  BASE: 'posts',
  SEARCH: 'search',
  DRAFTS: 'drafts',
  POST: ':id',
  CREATE: 'create',
  UPDATE: 'update/:id',
  PUBLISH: 'publish/:id',
  REPOST: 'repost/:id',
  DELETE: 'delete/:id',
} as const;
