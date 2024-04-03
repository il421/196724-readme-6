import { ChangeLog } from '../base';

export type Subscription = Pick<ChangeLog, 'createdAt'> & {
  id: string;
  userId: string;
};
