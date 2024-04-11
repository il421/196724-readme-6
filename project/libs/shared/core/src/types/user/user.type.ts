import { ChangeLog } from '../base';

export type User = Pick<ChangeLog, 'createdAt'> & {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  avatarId?: string;
  avatarUrl?: string;
  posts?: number;
  followers?: number;
};
