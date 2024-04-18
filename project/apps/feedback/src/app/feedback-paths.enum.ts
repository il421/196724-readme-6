export enum FeedbackPaths {
  Base = 'feedback',
  Comments = 'comments',
  CommentCreate = ':userId/comments/create',
  CommentDelete = ':userId/comments/:id/delete',
  LikeCreate = ':userId/likes/create',
  LikeDelete = ':userId/likes/:postId/create',
}
