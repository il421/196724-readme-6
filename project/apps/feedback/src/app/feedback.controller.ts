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
  ERROR_MESSAGES,
  RoutePaths,
  SUCCESS_MESSAGES,
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
    description: SUCCESS_MESSAGES.COMMENTS,
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
    description: SUCCESS_MESSAGES.COMMENT_CREATED,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ERROR_MESSAGES.POST_NOT_FOUND,
  })
  public async create(
    @Param('userId') userId: string,
    @Body() dto: CreateCommentDto
  ) {
    // @TODO need to grab user id from token
    const newComment = await this.feedbackService.createComment(userId, dto);
    return fillDto(CommentRdo, newComment.toPlainData());
  }

  @Delete(':userId/comments/:id/delete')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: SUCCESS_MESSAGES.COMMENT_DELETED,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGES.COMMENT_NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ERROR_MESSAGES.COMMENT_OTHER_USERS_DELETE,
  })
  public async delete(
    @Param('userId') userId: string,
    @Param('id') id: string
  ) {
    // @TODO need to grab user id from token
    return await this.feedbackService.deleteComment(userId, id);
  }

  @Post(':userId/likes/:postId/create')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: SUCCESS_MESSAGES.COMMENT_CREATED,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ERROR_MESSAGES.POST_NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ERROR_MESSAGES.POST_NOT_PUBLISHED,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ERROR_MESSAGES.POST_ALREADY_LIKED,
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
    description: SUCCESS_MESSAGES.COMMENT_DELETED,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGES.POST_NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ERROR_MESSAGES.POST_NOT_PUBLISHED,
  })
  public async unlike(
    @Param('userId') userId: string,
    @Param('postId') postId: string
  ) {
    // @TODO need to grab user id from token
    await this.feedbackService.unlike(userId, postId);
  }
}
