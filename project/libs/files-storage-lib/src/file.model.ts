import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { File } from '@project/core';

@Schema({
  collection: 'files',
  timestamps: true,
})
export class FileModel extends Document implements File {
  @Prop({ required: true })
  public format!: string;

  @Prop({ required: true })
  public path!: string;

  @Prop({
    required: true,
  })
  public createdAt!: string;

  @Prop({ required: true })
  public createdBy!: string;
}

export const FileSchema = SchemaFactory.createForClass(FileModel);
