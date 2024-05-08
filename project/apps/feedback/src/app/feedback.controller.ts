import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  HttpStatus,
  UseGuards,
  UsePipes,
  Query,
  Req,
} from '@nestjs/common';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  SWAGGER_TAGS,
  IPaginationQuery,
} from '@project/core';
import { CreateCommentDto, CommentRdo } from '@project/feedback-lib';
import { fillDto } from '@project/helpers';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import {
  DtoValidationPipe,
  FEEDBACK_PATHS,
  JwtAuthGuard,
} from '@project/data-access';
import { CreateCommentValidator } from './validator';
import { CommentsSearchQueryTransformPipe } from './pipes';
import { RequestWithUser } from '@project/users-lib';

@ApiTags(SWAGGER_TAGS.FEEDBACK)
@ApiBearerAuth()
@Controller(FEEDBACK_PATHS.BASE)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get(FEEDBACK_PATHS.COMMENTS)
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Default is 50',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: CommentRdo,
    description: SUCCESS_MESSAGES.COMMENTS,
  })
  public async getPostComments(
    @Param('postId') postId: string,
    @Query(CommentsSearchQueryTransformPipe) query?: IPaginationQuery
  ) {
    const commentsQueryResult = await this.feedbackService.getCommentsByPostId(
      postId,
      query?.limit,
      query?.page
    );

    return {
      ...commentsQueryResult,
      entities: commentsQueryResult.entities.map((comment) =>
        fillDto(CommentRdo, comment?.toPlainData())
      ),
    };
  }
  @Post(FEEDBACK_PATHS.COMMENT_CREATE)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CommentRdo,
    description: SUCCESS_MESSAGES.COMMENT_CREATED,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ERROR_MESSAGES.POST_NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ERROR_MESSAGES.UNAUTHORIZED,
  })
  public async create(
    @Body() dto: CreateCommentDto,
    @Req() { user }: RequestWithUser
  ) {
    const newComment = await this.feedbackService.createComment(user.id, dto);
    return fillDto(CommentRdo, newComment.toPlainData());
  }

  @Delete(FEEDBACK_PATHS.COMMENT_DELETE)
  @UseGuards(JwtAuthGuard)
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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ERROR_MESSAGES.UNAUTHORIZED,
  })
  public delete(@Param('id') id: string, @Req() { user }: RequestWithUser) {
    return this.feedbackService.deleteComment(user.id, id);
  }

  @Post(FEEDBACK_PATHS.LIKE_CREATE)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new DtoValidationPipe<CreateCommentDto>(CreateCommentValidator))
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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ERROR_MESSAGES.UNAUTHORIZED,
  })
  public like(
    @Param('postId') postId: string,
    @Req() { user }: RequestWithUser
  ) {
    return this.feedbackService.like(user.id, postId);
  }

  @Delete(FEEDBACK_PATHS.LIKE_DELETE)
  @UseGuards(JwtAuthGuard)
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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ERROR_MESSAGES.UNAUTHORIZED,
  })
  public unlike(
    @Param('postId') postId: string,
    @Req() { user }: RequestWithUser
  ) {
    return this.feedbackService.unlike(user.id, postId);
  }
}
