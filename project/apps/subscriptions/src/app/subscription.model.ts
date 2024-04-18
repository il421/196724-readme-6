import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MongoCollections, Subscription } from '@project/core';

@Schema({
  collection: MongoCollections.Subscriptions,
  timestamps: true,
})
export class SubscriptionModel extends Document implements Subscription {
  @Prop({ required: true, unique: true })
  public authorId!: string;

  @Prop({ required: true })
  public createdBy!: string;
}

export const SubscriptionSchema =
  SchemaFactory.createForClass(SubscriptionModel);
