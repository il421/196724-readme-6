import { ChangeLog } from '../base';

export type File = Pick<ChangeLog, 'createdAt' | 'createdBy'> & {
  id?: string;
  format: string;
  path: string;
};
