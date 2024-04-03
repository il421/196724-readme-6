import { BasePost } from './base-post.type.';

export type TextPost = BasePost<{
  announcement?: string;
  text?: string;
}>;
