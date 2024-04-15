import { Entity, IStorableEntity, Like } from '@project/core';

export class LikeEntity extends Entity implements IStorableEntity<Like> {
  public postId: string;
  public createdBy?: string;
  constructor(comment: Like) {
    const { id, postId, createdBy } = comment;
    super();
    this.id = id;
    this.postId = postId;
    this.createdBy = createdBy;
  }

  toPlainData(): Like {
    return {
      id: this.id,
      postId: this.postId,
      createdBy: this.createdBy,
    };
  }
}