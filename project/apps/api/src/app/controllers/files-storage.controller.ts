import {
  Controller,
  Delete,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiControllers } from './api-controllers.enum';
import {
  FILES_STORAGE_PATHS,
  MongoIdValidationPipe,
} from '@project/data-access';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ERROR_MESSAGES,
  FilesTypes,
  ServicesUrls,
  SUCCESS_MESSAGES,
  SWAGGER_TAGS,
} from '@project/core';
import { AxiosExceptionFilter } from '../filters';
import { InjectAuthorizationHeaderInterceptor } from '@project/interceptors-lib';
import {
  FIELD_NAME,
  FileRdo,
  FileSwaggerSchema,
  MIME_TYPE,
} from '@project/files-storage-lib';
import { FileInterceptor } from '@nestjs/platform-express';
import 'multer';
import FormData from 'form-data';

@Controller(ApiControllers.Files)
@UseFilters(AxiosExceptionFilter)
@ApiTags(SWAGGER_TAGS.FILES)
@ApiBearerAuth()
export class FilesStorageController {
  constructor(
    private readonly httpService: HttpService,
    private apiConfig: ConfigService
  ) {}

  get serviceUrls() {
    return this.apiConfig.get<ServicesUrls>('http-client.serviceUrls');
  }

  @Post(FILES_STORAGE_PATHS.UPLOAD)
  @UseInterceptors(FileInterceptor(FIELD_NAME))
  @UseInterceptors(InjectAuthorizationHeaderInterceptor)
  @ApiConsumes(MIME_TYPE)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: FileRdo,
    description: SUCCESS_MESSAGES.FILE_UPLOADED,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ERROR_MESSAGES.FILE_NOT_UPLOADED,
  })
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
    @UploadedFile() file: Express.Multer.File,
    @Query('type') type: FilesTypes
  ) {
    const formData = new FormData();
    formData.append(FIELD_NAME, Buffer.from(file.buffer), file.originalname);

    return (
      await this.httpService.axiosRef.post(
        `${this.serviceUrls.filesStorage}/${FILES_STORAGE_PATHS.UPLOAD}?type=${type}`,
        formData
      )
    ).data;
  }

  @Delete(FILES_STORAGE_PATHS.DELETE)
  @UseInterceptors(InjectAuthorizationHeaderInterceptor)
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
  public async delete(@Param('id', MongoIdValidationPipe) id: string) {
    return (
      await this.httpService.axiosRef.delete(
        `${this.serviceUrls.filesStorage}/${id}/delete`
      )
    ).data;
  }
}
