import { Entity } from '@project/core';

export interface IRepository<T extends Entity> {
  findById(id: T['id']): Promise<T | null>;
  save(entity: T): Promise<void>;
  update(entity: T): Promise<void | null>;
  deleteById(id: T['id']): Promise<void | null>;
}
