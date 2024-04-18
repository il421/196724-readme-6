import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, SWAGGER_TAGS } from '@project/core';
import { fillDto } from '@project/helpers';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  FIELD_NAME,
  filename,
  FileRdo,
  FILES_DESTINATION,
  FilesStorageService,
  FileSwaggerSchema,
  MIME_TYPE,
} from '@project/files-storage-lib';
import { FilesStoragePaths } from './files-storage-paths.enum';

@ApiTags(SWAGGER_TAGS.FILES)
@Controller(FilesStoragePaths.Base)
export class FilesStorageController {
  constructor(private readonly filesStorageService: FilesStorageService) {}

  @Post(FilesStoragePaths.FileUpload)
  @UseInterceptors(
    FileInterceptor(FIELD_NAME, {
      storage: diskStorage({ destination: FILES_DESTINATION, filename }),
    })
  )
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: FileRdo,
    description: SUCCESS_MESSAGES.FILE_UPLOADED,
  })
  @ApiConsumes(MIME_TYPE)
  @ApiBody({
    schema: FileSwaggerSchema,
  })
  public async upload(
    // @TODO files format and size validator
    @UploadedFile() file: Express.Multer.File,
    @Param('userId') userId: string
  ) {
    const newFile = await this.filesStorageService.upload(file, userId);
    return fillDto(FileRdo, newFile.toPlainData());
  }

  @Get(FilesStoragePaths.File)
  @ApiResponse({
    status: HttpStatus.OK,
    type: FileRdo,
    description: SUCCESS_MESSAGES.FILE,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGES.FILE_NOT_FOUND,
  })
  public async getById(@Param('id') id: string) {
    const newFile = await this.filesStorageService.findById(id);
    return fillDto(FileRdo, newFile.toPlainData());
  }

  @Delete(FilesStoragePaths.FileDeleted)
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS_MESSAGES.FILE_DELETED,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGES.FILE_NOT_FOUND,
  })
  public async delete(@Param('id') id: string) {
    return await this.filesStorageService.delete(id);
  }
}
