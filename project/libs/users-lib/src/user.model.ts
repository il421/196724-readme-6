import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MongoCollections, User } from '@project/core';

@Schema({
  collection: MongoCollections.Users,
  timestamps: true,
})
export class UserModel extends Document implements User {
  @Prop({ required: true })
  public firstName!: string;

  @Prop({ required: true })
  public lastName!: string;

  @Prop({
    required: true,
    unique: true,
  })
  public email!: string;

  @Prop({
    required: true,
  })
  public password!: string;

  @Prop()
  public avatarId?: string;

  @Prop({ default: 0 })
  public posts?: number;

  @Prop({ default: 0 })
  public followers?: number;

  @Prop()
  public latestPostsEmailDate?: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
