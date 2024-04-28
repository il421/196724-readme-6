export const FEEDBACK_PATHS = {
  BASE: 'feedback',
  COMMENTS: 'comments',
  COMMENT_CREATE: 'comments/create',
  COMMENT_DELETE: 'comments/:id/delete',
  LIKE_CREATE: 'likes/:postId/create',
  LIKE_DELETE: 'likes/:postId/delete',
} as const;
