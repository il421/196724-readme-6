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
  RoutePaths,
  SuccessMessages,
  SwaggerTags,
} from '@project/core';
import { CreateCommentDto } from './dtos';
import { fillDto } from '@project/helpers';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { CommentRdo } from './rdos';
import { PostRdo } from '../../../posts/src/app/rdos';

@ApiTags(SwaggerTags.Feedback)
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
  @Post(':userId/create')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CommentRdo,
    description: SuccessMessages.CommentCreated,
  })
  public async create(
    @Param('userId') userId: string,
    @Body() dto: CreateCommentDto
  ) {
    const newComment = await this.feedbackService.create(userId, dto);
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

  @Post(':userId/like/:postId')
  @ApiResponse({
    status: HttpStatus.OK,
    type: PostRdo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ErrorMessages.PostNotFound,
  })
  public async like(
    @Param('userId') userId: string,
    @Param('postId') postId: string
  ) {
    // @TODO need to grab user id from token
    await this.feedbackService.like(userId, postId);
  }
}
