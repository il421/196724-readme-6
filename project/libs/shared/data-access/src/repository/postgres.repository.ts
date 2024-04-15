import { IRepository } from './repository.interface';
import { Entity, IEntityFactory, IStorableEntity } from '@project/core';
import { Document } from 'mongoose';
import { PrismaClientService } from '@project/prisma-client';

export abstract class PostgresRepository<
  T extends Entity & IStorableEntity<ReturnType<T['toPlainData']>>,
  DocumentType = ReturnType<T['toPlainData']>
> implements IRepository<T>
{
  constructor(
    protected entityFactory: IEntityFactory<T>,
    protected readonly client: PrismaClientService
  ) {}

  protected createEntityFromDocument(document: DocumentType): T | null {
    if (!document) {
      return null;
    }

    return this.entityFactory.create(document as ReturnType<T['toPlainData']>);
  }

  public async findCommentById(id: T['id']): Promise<T> {
    throw new Error('Not implemented');
  }

  public async saveComment(entity: T): Promise<void> {
    throw new Error('Not implemented');
  }

  public async update(entity: T): Promise<void> {
    throw new Error('Not implemented');
  }

  public async deleteCommentById(id: T['id']): Promise<void> {
    throw new Error('Not implemented');
  }
}
