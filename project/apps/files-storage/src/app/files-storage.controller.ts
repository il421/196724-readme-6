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
} from '@project/files-storage-lib';
import { FilesStoragePaths } from './files-storage-paths.enum';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '@project/data-access';

@ApiTags(SWAGGER_TAGS.FILES)
@ApiBearerAuth()
@Controller(FilesStoragePaths.Base)
export class FilesStorageController {
  constructor(
    private readonly filesStorageService: FilesStorageService,
    private readonly jwtService: JwtService
  ) {}

  @Post(FilesStoragePaths.FileUpload)
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
  public async upload(
    @UploadedFile() file: Express.Multer.File,
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
  public async getById(@Param('id') id: string) {
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
  public delete(@Param('id') id: string) {
    return this.filesStorageService.delete(id);
  }
}
