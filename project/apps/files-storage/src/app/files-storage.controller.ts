import {
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ERROR_MESSAGES,
  FilesTypes,
  IHeaders,
  ITokenPayload,
  SUCCESS_MESSAGES,
  SWAGGER_TAGS,
} from '@project/core';
import { fillDto, getToken } from '@project/helpers';
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
  FIELD_NAME,
  FILES_STORAGE_PATHS,
  FileSwaggerSchema,
  MIME_TYPE,
} from './files-storage.constants';
import { JwtService } from '@nestjs/jwt';
import {
  DtoValidationPipe,
  JwtAuthGuard,
  MongoIdValidationPipe,
} from '@project/data-access';
import { FilesStorageService } from './files-storage.service';

import { FileRdo } from './rdos';
import { UploadFileValidator, UploadPhotoValidator } from './validator';

@ApiTags(SWAGGER_TAGS.FILES)
@ApiBearerAuth()
@Controller(FILES_STORAGE_PATHS.BASE)
export class FilesStorageController {
  constructor(
    private readonly filesStorageService: FilesStorageService,
    private readonly jwtService: JwtService
  ) {}

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
    schema: FileSwaggerSchema,
  })
  public async upload(
    @UploadedFile(
      new DtoValidationPipe<Express.Multer.File>(UploadFileValidator)
    )
    file: Express.Multer.File,
    @Query('type') type: FilesTypes,
    @Headers() headers: IHeaders
  ) {
    const { sub } = this.jwtService.decode<ITokenPayload>(getToken(headers));
    const newFile = await this.filesStorageService.upload(file, sub, type);
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
