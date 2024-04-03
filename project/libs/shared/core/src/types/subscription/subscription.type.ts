import { ChangeLog } from '../base';

export type Subscription = Pick<ChangeLog, 'createdAt' | 'createdBy'> & {
  id?: string;
  publisherId: string;
};
