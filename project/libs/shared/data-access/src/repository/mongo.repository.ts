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
    return this.entityFactory.create(plainObject);
  }

  public async findById(id: T['id']): Promise<T | null> {
    const document = await this.model.findById(id).exec();
    return this.createEntityFromDocument(document);
  }

  public async save(entity: T): Promise<void> {
    const newEntity = new this.model(entity.toPlainData());
    await newEntity.save();

    entity.id = newEntity._id.toString();
  }

  public async update(entity: T): Promise<void> {
    const updatedDocument = await this.model
      // @ts-ignore
      .findByIdAndUpdate(entity.id, entity.toPlainData(), {
        new: true,
        runValidators: true,
      })
      .exec();

    if (updatedDocument) {
      throw new NotFoundException(`Entity with id ${entity.id} not found`);
    }
  }

  public async deleteById(id: T['id']): Promise<void> {
    const deletedDocument = await this.model.findByIdAndDelete(id).exec();
    if (!deletedDocument) {
      throw new NotFoundException(`Entity with id ${id} not found.`);
    }
  }
}
