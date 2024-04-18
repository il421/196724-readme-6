import { Injectable, NotFoundException } from '@nestjs/common';
import { FilesStorageRepository } from './files-storage.repository';
import { FileEntity } from './file.entity';
import { File, ERROR_MESSAGES } from '@project/core';
import * as fs from 'fs';
import { getPath } from './utils';
import 'multer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesStorageService {
  constructor(
    private filesStorageRepository: FilesStorageRepository,
    private config: ConfigService
  ) {}

  public async upload(
    file: Express.Multer.File,
    userId: string
  ): Promise<FileEntity> {
    const dto: File = {
      createdBy: userId,
      format: file.mimetype,
      path: getPath(
        file.filename,
        this.config.get('application.host'),
        this.config.get('application.port')
      ),
    };
    const postEntity = new FileEntity(dto);
    await this.filesStorageRepository.save(postEntity);
    return postEntity;
  }

  public async delete(id: string): Promise<void> {
    const fileEntity = await this.filesStorageRepository.findById(id);

    // TODO not done yet, not sure what is the best way to delete document from my local storage
    if (fileEntity) {
      fs.unlinkSync(fileEntity.path);
    }
  }

  public async findById(id: string): Promise<FileEntity> {
    const fileEntity = await this.filesStorageRepository.findById(id);

    if (fileEntity) return fileEntity;
    throw new NotFoundException(ERROR_MESSAGES.FILE_NOT_FOUND);
  }
}
