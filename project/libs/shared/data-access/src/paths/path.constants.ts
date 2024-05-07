export const AUTHENTICATION_PATHS = {
  BASE: 'auth',
  CREATE: 'create',
  LOGIN: 'login',
  REFRESH: 'refresh',
  PASSWORD_UPDATE: 'password/update',
} as const;

export const FEEDBACK_PATHS = {
  BASE: 'feedback',
  COMMENTS: 'comments',
  COMMENT_CREATE: 'comments/create',
  COMMENT_DELETE: 'comments/:id/delete',
  LIKE_CREATE: 'likes/:postId/create',
  LIKE_DELETE: 'likes/:postId/delete',
} as const;

export const FILES_STORAGE_PATHS = {
  BASE: 'files',
  UPLOAD: 'upload',
  FILE: ':id',
  DELETE: ':id/delete',
} as const;

export const POST_PATHS = {
  BASE: 'posts',
  SEARCH: 'search',
  DRAFTS: 'drafts',
  POST: ':id',
  CREATE: 'create',
  UPDATE: 'update/:id',
  PUBLISH: 'publish/:id',
  REPOST: 'repost/:id',
  DELETE: 'delete/:id',
} as const;

export const SUBSCRIPTIONS_PATHS = {
  BASE: 'subscriptions',
  SUBSCRIPTIONS: '/',
  CREATE: 'create',
  DELETE: 'delete/:authorId',
} as const;

export const USERS_PATHS = {
  BASE: 'users',
  USER: ':id',
  UPDATE_AVATAR: 'update-avatar',
  RECEIVE_LATEST_POSTS: 'receive-latest-posts',
} as const;
