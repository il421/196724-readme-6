import { SearchPostsQuery } from './search-post.query';

export interface SearchSubscriptionPostQuery
  extends Pick<SearchPostsQuery, 'sortDirection' | 'limit' | 'page'> {}
