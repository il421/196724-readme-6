import { ChangeLog } from '../base';

export interface Comment extends Pick<ChangeLog, 'createdAt' | 'createdBy'> {
  id: string;
  postId: string;
  text: string;
}
