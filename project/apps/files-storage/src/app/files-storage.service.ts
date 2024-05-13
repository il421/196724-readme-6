import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilesStorageRepository } from './files-storage.repository';
import { FileEntity } from './file.entity';
import { ERROR_MESSAGES, File, FilesTypes } from '@project/core';
import 'multer';
import { ConfigService } from '@nestjs/config';
import { ensureDir, unlink, writeFile } from 'fs-extra';
import { join } from 'node:path';
import { getFileName, getServeFilePath } from './utils';
import {
  AVATAR_SUB_DIRECTORY,
  PHOTO_SUB_DIRECTORY,
} from './files-storage.constants';

@Injectable()
export class FilesStorageService {
  constructor(
    private filesStorageRepository: FilesStorageRepository,
    private config: ConfigService
  ) {}

  private get uploadDirectoryPath() {
    return this.config.get('storage.rootPath');
  }

  private get port() {
    return this.config.get('application.port');
  }

  private get host() {
    return this.config.get('application.host');
  }

  private get serveRoot() {
    return this.config.get('storage.serveRoot');
  }

  private getDestinationFilePath(
    filename: string,
    subDirectory: string
  ): string {
    return join(this.uploadDirectoryPath, subDirectory, filename);
  }

  private async write(
    file: Express.Multer.File,
    type: FilesTypes
  ): Promise<Omit<File, 'createdBy'>> {
    try {
      const name = getFileName(file);
      const subDirectory =
        type === FilesTypes.Avatar ? AVATAR_SUB_DIRECTORY : PHOTO_SUB_DIRECTORY;

      const destinationFilePath = this.getDestinationFilePath(
        name,
        subDirectory
      );

      await ensureDir(join(this.uploadDirectoryPath, subDirectory));
      await writeFile(destinationFilePath, file.buffer);
      const path = getServeFilePath({
        name,
        port: this.port,
        host: this.host,
        serveRoot: this.serveRoot,
      });

      return {
        format: file.mimetype,
        path,
        uploadDirectoryPath: destinationFilePath,
        name,
        originalName: file.originalname,
        size: file.size,
      };
    } catch (e) {
      throw new BadRequestException(e, ERROR_MESSAGES.FILE_NOT_UPLOADED);
    }
  }

  public async upload(
    file: Express.Multer.File,
    userId: string,
    type: FilesTypes
  ): Promise<FileEntity> {
    const storedFile = await this.write(file, type);
    const payload: File = {
      createdBy: userId,
      format: storedFile.format,
      path: storedFile.path,
      uploadDirectoryPath: storedFile.uploadDirectoryPath,
      name: storedFile.name,
      originalName: storedFile.originalName,
      size: storedFile.size,
    };
    const postEntity = new FileEntity(payload);
    await this.filesStorageRepository.save(postEntity);
    return postEntity;
  }

  public async delete(id: string): Promise<void> {
    const fileEntity = await this.filesStorageRepository.findById(id);
    if (!fileEntity) {
      throw new NotFoundException(ERROR_MESSAGES.FILE_NOT_FOUND);
    }

    if (fileEntity) {
      try {
        await unlink(fileEntity.uploadDirectoryPath);
      } catch (e) {
        throw new BadRequestException(e);
      }

      return void (await this.filesStorageRepository.deleteById(id));
    }
  }

  public async findById(id: string): Promise<FileEntity> {
    const fileEntity = await this.filesStorageRepository.findById(id);
    if (!fileEntity) throw new NotFoundException(ERROR_MESSAGES.FILE_NOT_FOUND);
    return fileEntity;
  }
}
