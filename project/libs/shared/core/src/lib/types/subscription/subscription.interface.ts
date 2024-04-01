import { ChangeLog } from '../base';

export interface Subscription extends Pick<ChangeLog, 'createdAt'> {
  id: string;
  userId: string;
}
