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
@Controller(RoutePaths.Feedback)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get('/comments')
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
  @Post(':userId/comments/create')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CommentRdo,
    description: SuccessMessages.CommentCreated,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ErrorMessages.PostNotFound,
  })
  public async create(
    @Param('userId') userId: string,
    @Body() dto: CreateCommentDto
  ) {
    const newComment = await this.feedbackService.createComment(userId, dto);
    return fillDto(CommentRdo, newComment.toPlainData());
  }

  @Delete(':userId/comments/:id/delete')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
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
    return await this.feedbackService.deleteComment(userId, id);
  }

  @Post(':userId/likes/:postId/create')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: SuccessMessages.CommentCreated,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ErrorMessages.PostNotFound,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ErrorMessages.PostNotPublish,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ErrorMessages.Liked,
  })
  public async like(
    @Param('userId') userId: string,
    @Param('postId') postId: string
  ) {
    // @TODO need to grab user id from token
    await this.feedbackService.like(userId, postId);
  }

  @Delete(':userId/likes/:postId/delete')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: SuccessMessages.CommentDeleted,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ErrorMessages.PostNotFound,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ErrorMessages.PostNotPublish,
  })
  public async unlike(
    @Param('userId') userId: string,
    @Param('postId') postId: string
  ) {
    // @TODO need to grab user id from token
    await this.feedbackService.unlike(userId, postId);
  }
}
