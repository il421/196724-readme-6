import { Entity } from '@project/core';

export interface IRepository<T extends Entity> {
  findCommentById(id: T['id']): Promise<T | null>;
  saveComment(entity: T): Promise<void>;
  update(entity: T): Promise<void>;
  deleteCommentById(id: T['id']): Promise<void>;
}
