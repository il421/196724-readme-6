import { PostState, PostType } from '@project/core';

export interface SearchPostsArgs {
  usersIds?: string[];
  tags?: string[];
  types?: PostType[];
  state?: PostState;
  title?: string;
}
