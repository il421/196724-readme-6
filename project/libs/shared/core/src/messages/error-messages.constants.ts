export const ErrorMessages = {
  UserNotFound: 'User not found',
  PostNotFound: 'Post not found',
  PostPublishConflict: 'User is not able publishing other users posts',
  PostNotPublish: 'Post is not published',
  FileNotFound: 'File not found',
  SubscriptionNotFound: 'Subscription not found',
  SubscriptionExists: 'Subscription exists already',
  CommentNotFound: 'Comment not found',
  CommentUserError: 'Not able to delete other users comments',
  UserBadPassword: 'User password is invalid',
  DuplicatedUser: 'User with this email exists',
  NoEmailOrPassword: 'Either email or passwords is not provided or incorrect',
} as const;
