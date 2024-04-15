import { Document, Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { Entity, IEntityFactory, IStorableEntity } from '@project/core';
import { IRepository } from '@project/data-access';

export abstract class MongoRepository<
  T extends Entity & IStorableEntity<ReturnType<T['toPlainData']>>,
  DocumentType extends Document
> implements IRepository<T>
{
  constructor(
    protected entityFactory: IEntityFactory<T>,
    protected readonly model: Model<DocumentType>
  ) {}

  protected createEntityFromDocument(document: DocumentType | null): T | null {
    if (!document) {
      return null;
    }

    const plainObject = document.toObject({ versionKey: false }) as ReturnType<
      T['toPlainData']
    >;

    const entity = this.entityFactory.create(plainObject);
    entity.id = document._id;
    return entity;
  }

  public async findCommentById(id: T['id']): Promise<T | null> {
    const document = await this.model.findById(id).exec();
    return this.createEntityFromDocument(document);
  }

  public async saveComment(entity: T): Promise<void> {
    const newEntity = new this.model(entity.toPlainData());
    await newEntity.save();

    entity.id = newEntity._id.toString();
  }

  public async update(entity: T): Promise<void> {
    const updatedDocument = await this.model
      .findByIdAndUpdate(entity.id, entity, {
        new: true,
      })
      .exec();

    if (!updatedDocument) {
      throw new NotFoundException(`Entity with id ${entity.id} not found`);
    }
  }

  public async deleteCommentById(id: T['id']): Promise<void> {
    const deletedDocument = await this.model.findByIdAndDelete(id).exec();
    if (!deletedDocument) {
      throw new NotFoundException(`Entity with id ${id} not found.`);
    }
  }
}
