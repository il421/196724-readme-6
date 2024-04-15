import { MongoRepository } from '@project/data-access';
import { UserEntity } from './user.entity';
import { UserFactory } from './user.factory';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from './user.model';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { addFollowers, subscriptionsLookup } from './user.pipelines';

@Injectable()
export class UserRepository extends MongoRepository<UserEntity, UserModel> {
  constructor(
    entityFactory: UserFactory,
    @InjectModel(UserModel.name)
    readonly userModel: Model<UserModel>
  ) {
    super(entityFactory, userModel);
  }

  public async searchById(id: string): Promise<UserEntity | null> {
    const [user] = await this.userModel
      .aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(id) },
        },
        subscriptionsLookup,
        addFollowers,
      ])
      .exec();

    if (!user) {
      return null;
    }

    const entity = this.entityFactory.create(user);
    entity.id = user._id;
    return entity;
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    const document = await this.model.findOne({ email }).exec();
    return this.createEntityFromDocument(document);
  }
}
