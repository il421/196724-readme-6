import { BasePost } from './base-post';

export type TextPost = BasePost & {
  announcement: string;
  text: string;
};
