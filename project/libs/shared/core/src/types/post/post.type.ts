import {
  PhotoPost,
  QuotePost,
  RefPost,
  TextPost,
  VideoPost,
} from '@project/core';

export type Post = TextPost | PhotoPost | VideoPost | QuotePost | RefPost;
