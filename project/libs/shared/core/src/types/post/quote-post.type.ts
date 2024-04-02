import { BasePost } from './base-post';

export type QuotePost = BasePost & {
  quoteAuthor: string;
  text: string;
};
