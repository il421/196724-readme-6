import { CreatePostsNotificationDto } from './create-posts-notification.dto';
import { Post } from '@project/core';

export class CreatePostsEmailDto extends CreatePostsNotificationDto {
  posts!: Post[];
}
