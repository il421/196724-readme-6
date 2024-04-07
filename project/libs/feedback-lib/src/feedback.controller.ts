import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  HttpStatus,
} from '@nestjs/common';
import {
  ErrorMessages,
  OpenApiTags,
  RoutePaths,
  SuccessMessages,
} from '@project/core';
import { CreateCommentDto } from './dtos';
import { fillDto } from '@project/helpers';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { CommentRdo } from './rdos';

@ApiTags(OpenApiTags.Comments)
@Controller(RoutePaths.Comments)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get('/')
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: CommentRdo,
    description: SuccessMessages.Comments,
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
    type: CommentRdo,
    description: SuccessMessages.CommentCreated,
  })
  public async create(@Body() dto: CreateCommentDto) {
    const newComment = await this.feedbackService.create(dto);
    return fillDto(CommentRdo, newComment.toPlainData());
  }

  @Delete('user/:userId/delete/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: SuccessMessages.CommentDeleted,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ErrorMessages.CommentNotFound,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ErrorMessages.CommentUserError,
  })
  public async delete(
    @Param('userId') userId: string,
    @Param('id') id: string
  ) {
    return await this.feedbackService.delete(userId, id);
  }
}
