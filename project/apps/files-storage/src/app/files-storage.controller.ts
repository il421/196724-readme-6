import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ERROR_MESSAGES,
  FilesTypes,
  SUCCESS_MESSAGES,
  SWAGGER_TAGS,
} from '@project/core';
import { fillDto } from '@project/helpers';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';

import {
  DtoValidationPipe,
  FILES_STORAGE_PATHS,
  JwtAuthGuard,
  MongoIdValidationPipe,
} from '@project/data-access';
import { FilesStorageService } from './files-storage.service';

import {
  FIELD_NAME,
  FileRdo,
  FILE_SWAGGER_SCHEMA,
  MIME_TYPE,
} from '@project/files-storage-lib';
import { UploadFileValidator } from './validator';
import { RequestWithUser } from '@project/users-lib';

@ApiTags(SWAGGER_TAGS.FILES)
@ApiBearerAuth()
@Controller(FILES_STORAGE_PATHS.BASE)
export class FilesStorageController {
  constructor(private readonly filesStorageService: FilesStorageService) {}

  @Post(FILES_STORAGE_PATHS.UPLOAD)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor(FIELD_NAME))
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: FileRdo,
    description: SUCCESS_MESSAGES.FILE_UPLOADED,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ERROR_MESSAGES.FILE_NOT_UPLOADED,
  })
  @ApiConsumes(MIME_TYPE)
  @ApiQuery({
    name: 'type',
    required: true,
    type: String,
    enumName: 'FilesTypes',
    enum: FilesTypes,
  })
  @ApiBody({
    schema: FILE_SWAGGER_SCHEMA,
  })
  public async upload(
    @UploadedFile(
      new DtoValidationPipe<Express.Multer.File>(UploadFileValidator)
    )
    file: Express.Multer.File,
    @Query('type') type: FilesTypes,
    @Req() { user }: RequestWithUser
  ) {
    const newFile = await this.filesStorageService.upload(file, user.id, type);
    return fillDto(FileRdo, newFile.toPlainData());
  }

  @Get(FILES_STORAGE_PATHS.FILE)
  @ApiResponse({
    status: HttpStatus.OK,
    type: FileRdo,
    description: SUCCESS_MESSAGES.FILE,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGES.FILE_NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ERROR_MESSAGES.BAD_MONGO_ID_ERROR,
  })
  public async getById(@Param('id', MongoIdValidationPipe) id: string) {
    const newFile = await this.filesStorageService.findById(id);
    return fillDto(FileRdo, newFile.toPlainData());
  }

  @Delete(FILES_STORAGE_PATHS.DELETE)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS_MESSAGES.FILE_DELETED,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGES.FILE_NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ERROR_MESSAGES.BAD_MONGO_ID_ERROR,
  })
  public delete(@Param('id', MongoIdValidationPipe) id: string) {
    return this.filesStorageService.delete(id);
  }
}
