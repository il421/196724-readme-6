import { ChangeLog } from '../base';

export type Like = Pick<ChangeLog, 'createdBy'> & {
  id?: string;
  postId: string;
};
