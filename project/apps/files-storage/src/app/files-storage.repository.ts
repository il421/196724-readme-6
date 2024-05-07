import { MongoRepository } from '@project/data-access';
import { FileEntity } from './file.entity';
import { Injectable } from '@nestjs/common';
import { FilesStorageFactory } from './files-storage.factory';
import { FileModel } from './file.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FilesStorageRepository extends MongoRepository<
  FileEntity,
  FileModel
> {
  constructor(
    entityFactory: FilesStorageFactory,
    @InjectModel(FileModel.name) fileModel: Model<FileModel>
  ) {
    super(entityFactory, fileModel);
  }
}
