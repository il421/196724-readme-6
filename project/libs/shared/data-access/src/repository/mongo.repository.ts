import { Document, Model } from 'mongoose';
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

    const plainObject = document.toObject({
      getters: true,
      versionKey: false,
      flattenObjectIds: true,
    }) as ReturnType<T['toPlainData']>;

    const entity = this.entityFactory.create(plainObject);
    entity.id = document._id;
    return entity;
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
    return void (await this.model
      .findByIdAndUpdate(entity.id, entity, {
        new: true,
      })
      .exec());
  }

  public async deleteById(id: T['id']): Promise<void> {
    return void (await this.model.findByIdAndDelete(id).exec());
  }
}
