import { ChangeLog } from '../base';

export interface User extends Pick<ChangeLog, 'createdAt'> {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  avatarUrl?: string;
  posts?: number;
  likedPosts?: string[];
  subscribedBlogs?: string[];
  receiveNotifications?: boolean;
}
