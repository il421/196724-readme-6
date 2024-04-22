import { PostState, PostType, SortDirection } from '@project/core';

export interface SearchPostsQuery {
  usersIds?: string[];
  tags?: string[];
  types?: PostType[];
  state?: PostState;
  title?: string;
  limit?: number;
  page?: number;
  sortDirection?: SortDirection;
}
