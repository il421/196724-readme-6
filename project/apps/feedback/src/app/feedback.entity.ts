import { Comment, Entity, IStorableEntity } from '@project/core';

export class FeedbackEntity extends Entity implements IStorableEntity<Comment> {
  public text: string;
  public postId: string;
  public createdBy?: string;
  public createdAt?: string;
  constructor(comment: Comment) {
    const { id, text, postId, createdBy, createdAt } = comment;
    super();
    this.id = id;
    this.text = text;
    this.postId = postId;
    this.createdBy = createdBy;
    this.createdAt = createdAt ?? new Date().toISOString();
  }

  toPlainData(): Comment {
    return {
      id: this.id,
      text: this.text,
      postId: this.postId,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
    };
  }
}
