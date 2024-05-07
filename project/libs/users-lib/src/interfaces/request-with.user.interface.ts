import { UserEntity } from '@project/users-lib';

export interface RequestWithUser {
  user?: UserEntity;
}
