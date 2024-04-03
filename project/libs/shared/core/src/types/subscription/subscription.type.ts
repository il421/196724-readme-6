import { ChangeLog } from '../base';

export type Subscription = Pick<ChangeLog, 'createdAt' | 'createdBy'> & {
  id?: string;
  publisherId: string;
  lastSent?: string; // @TODO not sure about the extra field but looks like we need one
};
