import { Post } from './post.interface';

export interface QuotePost extends Post {
  quoteAuthor: string;
  text: string;
}
