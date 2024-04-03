import { Tag } from './tag.type';
import { PostTypes } from './post-types.enum';
import { PostState } from './post-state.enum';
import { ChangeLog } from '../base';

export type BasePost<T> = T &
  ChangeLog & {
    id?: string;
    name: string;
    type: PostTypes;
    state: PostState;
    isRepost?: boolean;
    tags?: Tag[];
  };
