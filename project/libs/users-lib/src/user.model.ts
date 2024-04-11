import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@project/core';

@Schema({
  collection: 'users',
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
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
