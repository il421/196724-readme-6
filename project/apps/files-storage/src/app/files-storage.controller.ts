import {
  Controller,
  Param,
  Post,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Get,
  Delete,
} from '@nestjs/common';
import {
  SwaggerTags,
  RoutePaths,
  SwaggerSuccessMessages,
  SwaggerErrorMessages,
} from '@project/core';
import { fillDto } from '@project/helpers';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  FilesStorageService,
  FIELD_NAME,
  FILES_DESTINATION,
  FileRdo,
  MIME_TYPE,
  FileSwaggerSchema,
  filename,
} from '@project/files-storage-lib';

@ApiTags(SwaggerTags.Files)
@Controller(RoutePaths.Files)
export class FilesStorageController {
  constructor(private readonly filesStorageService: FilesStorageService) {}

  @Post('upload/:userId')
  @UseInterceptors(
    FileInterceptor(FIELD_NAME, {
      storage: diskStorage({ destination: FILES_DESTINATION, filename }),
    })
  )
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: FileRdo,
    description: SwaggerSuccessMessages.FileUploaded,
  })
  @ApiConsumes(MIME_TYPE)
  @ApiBody({
    schema: FileSwaggerSchema,
  })
  public async upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('userId') userId: string
  ) {
    const newFile = await this.filesStorageService.create(userId, file);
    return fillDto(FileRdo, newFile.toPlainData());
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: FileRdo,
    description: SwaggerSuccessMessages.File,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: SwaggerErrorMessages.FileNotFound,
  })
  public async getById(@Param('id') id: string) {
    const newFile = await this.filesStorageService.findById(id);
    return fillDto(FileRdo, newFile.toPlainData());
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: SwaggerSuccessMessages.FileDeleted,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: SwaggerErrorMessages.FileNotFound,
  })
  public async delete(@Param('id') id: string) {
    return await this.filesStorageService.delete(id);
  }
}
