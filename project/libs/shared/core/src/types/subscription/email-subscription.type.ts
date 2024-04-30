import { ChangeLog } from '../base';

export type EmailSubscription = Pick<ChangeLog, 'createdAt' | 'createdBy'> & {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
};
