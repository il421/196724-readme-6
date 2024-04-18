import { MongoRepository } from '@project/data-access';
import { SubscriptionsEntity } from './subscriptions.entity';
import { Injectable } from '@nestjs/common';
import { SubscriptionsFactory } from './subscriptions.factory';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscriptionModel } from './subscription.model';

@Injectable()
export class SubscriptionsRepository extends MongoRepository<
  SubscriptionsEntity,
  SubscriptionModel
> {
  constructor(
    entityFactory: SubscriptionsFactory,
    @InjectModel(SubscriptionModel.name)
    subscriptionsModel: Model<SubscriptionModel>
  ) {
    super(entityFactory, subscriptionsModel);
  }

  public findByAuthorId(userId: string, authorId: string) {
    return this.model.findOne({ createdBy: userId, authorId }).exec();
  }

  public async findByUserId(userId: string) {
    const subscriptionsDocuments = await this.model
      .find({ createdBy: userId })
      .exec();
    return subscriptionsDocuments.map((document) =>
      this.createEntityFromDocument(document)
    );
  }
}
