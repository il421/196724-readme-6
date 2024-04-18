import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  HttpStatus,
} from '@nestjs/common';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, SWAGGER_TAGS } from '@project/core';
import { CreateCommentDto } from './dtos';
import { fillDto } from '@project/helpers';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { CommentRdo } from './rdos';
import { FeedbackPaths } from './feedback-paths.enum';

@ApiTags(SWAGGER_TAGS.FEEDBACK)
@Controller(FeedbackPaths.Base)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get(FeedbackPaths.Comments)
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
  @Post(FeedbackPaths.CommentCreate)
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

  @Delete(FeedbackPaths.CommentDelete)
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
  public delete(@Param('userId') userId: string, @Param('id') id: string) {
    // @TODO need to grab user id from token
    return this.feedbackService.deleteComment(userId, id);
  }

  @Post(FeedbackPaths.LikeCreate)
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
  public like(
    @Param('userId') userId: string,
    @Param('postId') postId: string
  ) {
    // @TODO need to grab user id from token
    return this.feedbackService.like(userId, postId);
  }

  @Delete(FeedbackPaths.LikeDelete)
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
  public unlike(
    @Param('userId') userId: string,
    @Param('postId') postId: string
  ) {
    // @TODO need to grab user id from token
    return this.feedbackService.unlike(userId, postId);
  }
}
