import {
  Entity,
  IStorableEntity,
  Post,
  PostState,
  PostTypes,
} from '@project/core';

export class PostEntity extends Entity implements IStorableEntity<Post> {
  public name: string;
  public type: PostTypes;
  public state: PostState;
  public tags: string[];
  public isRepost?: boolean;
  public likes: string[];
  public createdBy?: string;
  public createdAt?: string;
  public publishedBy?: string;
  public publishedAt?: string;
  public semanticData: object;

  private currentDateIso = new Date().toISOString();
  constructor(post: Post) {
    const {
      id,
      title,
      type,
      state,
      tags,
      isRepost,
      createdBy,
      createdAt,
      publishedBy,
      publishedAt,
      likes,
      ...semanticData
    } = post;
    super();
    this.id = id;
    this.name = title;
    this.type = type;
    this.state = state;
    this.tags = tags ?? [];
    this.isRepost = isRepost;
    this.likes = likes ?? [];
    this.createdBy = createdBy;
    this.createdAt = createdAt ?? this.currentDateIso;
    this.publishedBy = publishedBy ?? this.currentDateIso;
    this.publishedAt = publishedAt;
    this.semanticData = semanticData;
  }

  toPlainData(): Post {
    return {
      id: this.id,
      title: this.name,
      type: this.type,
      state: this.state,
      tags: this.tags,
      isRepost: this.isRepost,
      likes: this.likes,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      publishedBy: this.publishedBy,
      publishedAt: this.publishedAt,
      ...this.semanticData,
    };
  }
}
