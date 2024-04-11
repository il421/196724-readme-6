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
import {
  RoutePaths,
  ErrorMessages,
  SuccessMessages,
  SwaggerTags,
} from '@project/core';
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

@ApiTags(SwaggerTags.Files)
@Controller(RoutePaths.Files)
export class FilesStorageController {
  constructor(private readonly filesStorageService: FilesStorageService) {}

  @Post(':userId')
  @UseInterceptors(
    FileInterceptor(FIELD_NAME, {
      storage: diskStorage({ destination: FILES_DESTINATION, filename }),
    })
  )
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: FileRdo,
    description: SuccessMessages.FileUploaded,
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

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: FileRdo,
    description: SuccessMessages.File,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ErrorMessages.FileNotFound,
  })
  public async getById(@Param('id') id: string) {
    const newFile = await this.filesStorageService.findById(id);
    return fillDto(FileRdo, newFile.toPlainData());
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: SuccessMessages.FileDeleted,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ErrorMessages.FileNotFound,
  })
  public async delete(@Param('id') id: string) {
    return await this.filesStorageService.delete(id);
  }
}
