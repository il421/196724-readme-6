import { Tag } from './tag.interface';
import { PostTypes } from './post-types.enum';
import { PostState } from './post-state.enum';
import { ChangeLog } from '../base';

export interface Post extends ChangeLog {
  id: string;
  name: string;
  type: PostTypes;
  state: PostState;
  isRepost?: boolean;
  tags?: Tag[];
}
