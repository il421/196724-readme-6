import { IEntityFactory, File } from '@project/core';
import { Injectable } from '@nestjs/common';
import { FileEntity } from './file.entity';

@Injectable()
export class FilesStorageFactory implements IEntityFactory<FileEntity> {
  public create(data: File): FileEntity {
    return new FileEntity(data);
  }
}
