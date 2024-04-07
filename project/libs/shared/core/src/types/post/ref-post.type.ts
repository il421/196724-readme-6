import { BasePost } from './base-post.type.';

export type RefPost = BasePost<{
  url?: string;
  description?: string;
}>;
