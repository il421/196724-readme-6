import { ChangeLog } from '../base';

export type Comment = Pick<ChangeLog, 'createdAt' | 'createdBy'> & {
  id?: string;
  postId: string;
  text: string;
};
