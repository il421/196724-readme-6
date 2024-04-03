import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  HttpStatus,
} from '@nestjs/common';
import { OpenApiTags, RoutePaths } from '@project/core';
import { CreateCommentDto } from './dtos';
import { fillDto } from '@project/helpers';
import {
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { CommentRdo } from './rdos';

@ApiTags(OpenApiTags.Comments)
@ApiExtraModels(CommentRdo)
@Controller(RoutePaths.Comments)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get('/')
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    schema: {
      $ref: getSchemaPath(CommentRdo),
    },
  })
  public async getPostComments(@Param('postId') postId: string) {
    const comments = await this.feedbackService.getCommentsByPostId(postId);
    return comments.map((comment) =>
      fillDto(CommentRdo, comment.toPlainData())
    );
  }
  @Post('create')
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      $ref: getSchemaPath(CommentRdo),
    },
  })
  public async create(@Body() dto: CreateCommentDto) {
    const newComment = await this.feedbackService.create(dto);
    return fillDto(CommentRdo, newComment.toPlainData());
  }

  @Delete('delete')
  public async delete(@Param('id') id: string) {
    return await this.feedbackService.delete(id);
  }
}
