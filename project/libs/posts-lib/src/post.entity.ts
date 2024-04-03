import {
  Entity,
  IStorableEntity,
  Post,
  PostState,
  PostTypes,
  Tag,
} from '@project/core';

export class PostEntity extends Entity implements IStorableEntity<Post> {
  public name: string;
  public type: PostTypes;
  public state: PostState;
  public tags: Tag[];
  public isRepost: boolean;
  public createdBy?: string;
  public createdAt?: string;
  public publishedBy?: string;
  public publishedAt?: string;
  public data: object;
  constructor(post: Post) {
    const {
      id,
      name,
      type,
      state,
      tags,
      isRepost,
      createdBy,
      createdAt,
      publishedBy,
      publishedAt,
      ...data
    } = post;
    super();
    this.id = id;
    this.name = name;
    this.type = type;
    this.state = state;
    this.tags = tags ?? [];
    this.isRepost = !!isRepost;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.publishedBy = publishedBy;
    this.publishedAt = publishedAt;
    this.data = data;
  }

  toPlainData(): Post {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      state: this.state,
      tags: this.tags,
      isRepost: this.isRepost,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      publishedBy: this.publishedBy,
      publishedAt: this.publishedAt,
      ...this.data,
    };
  }
}
