import {
  Entity,
  IStorableEntity,
  Post,
  PostState,
  PostType,
} from '@project/core';

export class PostEntity extends Entity implements IStorableEntity<Post> {
  public title?: string;
  public type: PostType;
  public state: PostState;
  public tags: string[];
  public isRepost?: boolean;
  public createdAt?: Date;
  public publishedAt?: Date;
  public createdBy: string;
  public publishedBy?: string;
  public text: string;
  public quoteAuthor: string;
  public url: string;
  public photoId: string;
  public description: string;
  public announcement: string;
  public commentsCount?: number;
  public likesCount?: number;

  constructor(post: Post) {
    super();
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
      photoId,
      description,
      quoteAuthor,
      announcement,
      _count,
    } = post;
    this.id = id;
    this.title = title;
    this.type = type;
    this.state = state;
    this.tags = tags;
    this.isRepost = !!isRepost;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.publishedBy = publishedBy;
    this.publishedAt = publishedAt;

    this.text = text;
    this.url = url;
    this.photoId = photoId;
    this.description = description;
    this.quoteAuthor = quoteAuthor;
    this.announcement = announcement;

    this.commentsCount = _count?.comments || undefined;
    this.likesCount = _count?.likes || undefined;
  }

  public toPlainData(): Post {
    return {
      id: this.id,
      title: this.title,
      type: this.type as PostType,
      state: this.state as PostState,
      tags: this.tags,
      isRepost: this.isRepost,
      createdBy: this.createdBy,
      publishedBy: this.publishedBy,
      createdAt: this.createdAt,
      publishedAt: this.publishedAt,
      text: this.text,
      url: this.url,
      photoId: this.photoId,
      description: this.description,
      quoteAuthor: this.quoteAuthor,
      announcement: this.announcement,
      likesCount: this.likesCount,
      commentsCount: this.commentsCount,
    };
  }
}
