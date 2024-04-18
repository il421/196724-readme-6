import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { File, MongoCollections } from '@project/core';

@Schema({
  collection: MongoCollections.Files,
  timestamps: true,
})
export class FileModel extends Document implements File {
  @Prop({ required: true })
  public format!: string;

  @Prop({ required: true })
  public path!: string;

  @Prop({ required: true })
  public name!: string;

  @Prop({
    required: true,
  })
  public createdAt!: Date;

  @Prop({ required: true })
  public createdBy!: string;
}

export const FileSchema = SchemaFactory.createForClass(FileModel);
