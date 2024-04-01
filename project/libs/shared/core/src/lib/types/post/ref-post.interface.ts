import { Post } from './post.interface';

export interface RefPost extends Post {
  url: string;
  description?: string;
}
