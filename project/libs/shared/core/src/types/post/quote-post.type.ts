import { BasePost } from './base-post.type.';

export type QuotePost = BasePost<{
  quoteAuthor?: string;
  text?: string;
}>;
