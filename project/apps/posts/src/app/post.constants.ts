import { ParseArrayOptions } from '@nestjs/common';

export const DEFAULT_NUMBER_OF_POSTS = 25;

export const PARSE_QUERY_ARRAY_PIPE_OPTIONS: ParseArrayOptions = {
  items: String,
  separator: ',',
  optional: true,
};
