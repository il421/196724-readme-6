import { Injectable, NotFoundException } from '@nestjs/common';
import { FilesStorageRepository } from './files-storage.repository';
import { FileEntity } from './file.entity';
import { File, SwaggerErrorMessages } from '@project/core';
import * as fs from 'fs';
import { path } from './utils';
import 'multer';
@Injectable()
export class FilesStorageService {
  constructor(private filesStorageRepository: FilesStorageRepository) {}

  public async create(
    userId: string,
    file: Express.Multer.File
  ): Promise<FileEntity> {
    const dto: File = {
      createdBy: userId,
      format: file.mimetype,
      path: path(file),
    };
    const postEntity = new FileEntity(dto);
    await this.filesStorageRepository.save(postEntity);
    return postEntity;
  }

  public async delete(id: string): Promise<void> {
    const fileEntity = await this.filesStorageRepository.findById(id);

    // TODO not done yet
    if (fileEntity) {
      fs.unlinkSync(fileEntity.path);
    }
  }

  public async findById(id: string): Promise<FileEntity> {
    const fileEntity = await this.filesStorageRepository.findById(id);

    if (fileEntity) return fileEntity;
    throw new NotFoundException(SwaggerErrorMessages.FileNotFound);
  }
}
