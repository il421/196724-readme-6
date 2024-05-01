import {
  IPaginationQuery,
  PostState,
  PostType,
  SortDirection,
} from '@project/core';

export interface SearchPostsQuery extends IPaginationQuery {
  usersIds?: string[];
  tags?: string[];
  types?: PostType[];
  state?: PostState;
  title?: string;
  sortDirection?: SortDirection;
  fromPublishDate?: Date;
}
