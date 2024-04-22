import {
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ERROR_MESSAGES,
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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

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
  UploadAvatarValidator,
  UploadPhotoValidator,
} from '@project/files-storage-lib';
import { FilesStoragePaths } from './files-storage-paths.enum';
import { JwtService } from '@nestjs/jwt';
import {
  DtoValidationPipe,
  JwtAuthGuard,
  MongoIdValidationPipe,
} from '@project/data-access';

@ApiTags(SWAGGER_TAGS.FILES)
@ApiBearerAuth()
@Controller(FilesStoragePaths.Base)
export class FilesStorageController {
  constructor(
    private readonly filesStorageService: FilesStorageService,
    private readonly jwtService: JwtService
  ) {}

  @Post(FilesStoragePaths.AvatarUpload)
  @UseGuards(JwtAuthGuard)
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
  public async uploadAvatar(
    @UploadedFile(
      new DtoValidationPipe<Express.Multer.File>(UploadAvatarValidator)
    )
    file: Express.Multer.File,
    @Headers() headers: IHeaders
  ) {
    const { sub } = this.jwtService.decode<ITokenPayload>(getToken(headers));
    const newFile = await this.filesStorageService.upload(file, sub);
    return fillDto(FileRdo, newFile.toPlainData());
  }

  @Post(FilesStoragePaths.PhotoUpload)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    // @TODO it is ignoring validations at the moment
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
  public async uploadPhoto(
    @UploadedFile(
      new DtoValidationPipe<Express.Multer.File>(UploadPhotoValidator)
    )
    file: Express.Multer.File,
    @Headers() headers: IHeaders
  ) {
    const { sub } = this.jwtService.decode<ITokenPayload>(getToken(headers));
    const newFile = await this.filesStorageService.upload(file, sub);
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
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ERROR_MESSAGES.BAD_MONGO_ID_ERROR,
  })
  public async getById(@Param('id', MongoIdValidationPipe) id: string) {
    const newFile = await this.filesStorageService.findById(id);
    return fillDto(FileRdo, newFile.toPlainData());
  }

  @Delete(FilesStoragePaths.FileDeleted)
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
