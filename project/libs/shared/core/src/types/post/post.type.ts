import { PostType } from './post-type.type';
import { PostState } from './post-state.type';
import { ChangeLog } from '../base';
import { Count } from './count.type';

export type Post = ChangeLog & {
  id?: string;
  title?: string;
  type: PostType;
  state?: PostState;
  isRepost?: boolean;
  tags?: string[];

  text?: string;
  announcement?: string;
  url?: string;
  quoteAuthor?: string;
  description?: string;

  _count?: Count;

  likesCount?: number;
  commentsCount?: number;
};
