import {
  Entity,
  IStorableEntity,
  Post,
  PostState,
  PostType,
} from '@project/core';

export class PostEntity extends Entity implements IStorableEntity<Post> {
  public title: string;
  public type: PostType;
  public state: PostState;
  public tags: string[];
  public isRepost?: boolean;
  public likes?: number;
  public createdAt?: Date;
  public publishedAt?: Date;
  public createdBy: string;
  public publishedBy?: string;
  public text: string;
  public quoteAuthor: string;
  public url: string;
  public description: string;
  public announcement: string;

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
      text,
      url,
      description,
      quoteAuthor,
      announcement,
      likes,
    } = post;
    super();
    this.id = id;
    this.title = title;
    this.type = type;
    this.state = state;
    this.tags = tags;
    this.isRepost = isRepost;
    this.likes = likes;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.publishedBy = publishedBy;
    this.publishedAt = publishedAt;
    this.text = text;
    this.url = url;
    this.description = description;
    this.quoteAuthor = quoteAuthor;
    this.announcement = announcement;
  }

  public toPlainData(): Post {
    return {
      id: this.id,
      title: this.title,
      type: this.type as PostType,
      state: this.state as PostState,
      tags: this.tags,
      isRepost: this.isRepost,
      likes: this.likes,
      createdBy: this.createdBy,
      publishedBy: this.publishedBy,
      createdAt: this.createdAt,
      publishedAt: this.createdAt,
      text: this.text,
      url: this.url,
      description: this.description,
      quoteAuthor: this.quoteAuthor,
      announcement: this.announcement,
    };
  }
}
