import { BasePost } from './base-post';

export type RefPost = BasePost & {
  url: string;
  description?: string;
};
