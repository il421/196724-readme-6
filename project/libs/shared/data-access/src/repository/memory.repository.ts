import { IRepository } from './repository.interface';
import {
  Entity,
  ErrorMessages,
  IEntityFactory,
  IStorableEntity,
} from '@project/core';
import { randomUUID } from 'node:crypto';

export class MemoryRepository<
  T extends Entity & IStorableEntity<ReturnType<T['toPlainData']>>
> implements IRepository<T>
{
  protected entities: Map<T['id'], ReturnType<T['toPlainData']>> = new Map();
  constructor(protected entityFactory: IEntityFactory<T>) {}

  public async findById(id: T['id']): Promise<T | null> {
    const entity = this.entities.get(id);
    if (!entity) {
      return null;
    }
    return this.entityFactory.create(entity);
  }

  public async save(entity: T): Promise<void> {
    if (!entity.id) {
      entity.id = randomUUID();
    }

    this.entities.set(entity.id, entity.toPlainData());
  }

  public async update(entity: T): Promise<void> {
    if (!this.entities.has(entity.id)) {
      throw new Error(ErrorMessages.EntityNotFound);
    }

    this.entities.set(entity.id, entity.toPlainData());
  }

  public async deleteById(id: T['id']): Promise<void> {
    if (!this.entities.has(id)) {
      throw new Error(ErrorMessages.EntityNotFound);
    }

    this.entities.delete(id);
  }
}
