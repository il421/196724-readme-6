import { IRepository } from './repository.interface';
import { Entity, IEntityFactory, IStorableEntity } from '@project/core';
import { randomUUID } from 'node:crypto';

export class MemoryRepository<
  T extends Entity & IStorableEntity<ReturnType<T['toPlainData']>>
> implements IRepository<T>
{
  protected entities: Map<T['id'], ReturnType<T['toPlainData']>> = new Map();
  constructor(protected entityFactory: IEntityFactory<T>) {}

  public async findCommentById(id: T['id']): Promise<T | null> {
    const entity = this.entities.get(id);
    if (!entity) {
      return null;
    }
    return this.entityFactory.create(entity);
  }

  public async saveComment(entity: T): Promise<void> {
    if (!entity.id) {
      entity.id = randomUUID();
    }

    this.entities.set(entity.id, entity.toPlainData());
  }

  public async update(entity: T): Promise<void> {
    this.entities.set(entity.id, entity.toPlainData());
  }

  public async deleteCommentById(id: T['id']): Promise<void> {
    this.entities.delete(id);
  }
}
