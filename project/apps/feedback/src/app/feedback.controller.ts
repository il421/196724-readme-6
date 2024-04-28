import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  HttpStatus,
  Headers,
  UseGuards,
  UsePipes,
  Query,
} from '@nestjs/common';
import {
  ERROR_MESSAGES,
  IHeaders,
  ITokenPayload,
  SUCCESS_MESSAGES,
  SWAGGER_TAGS,
} from '@project/core';
import { CreateCommentDto } from './dtos';
import { fillDto, getToken } from '@project/helpers';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { CommentRdo } from './rdos';
import { FEEDBACK_PATHS } from './feedback.constants';
import {
  DtoValidationPipe,
  JwtAuthGuard,
  ParseStringPipe,
} from '@project/data-access';
import { JwtService } from '@nestjs/jwt';
import { CreateCommentValidator } from './validator';

@ApiTags(SWAGGER_TAGS.FEEDBACK)
@ApiBearerAuth()
@Controller(FEEDBACK_PATHS.BASE)
export class FeedbackController {
  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly jwtService: JwtService
  ) {}

  @Get(FEEDBACK_PATHS.COMMENTS)
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Default is 50',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: CommentRdo,
    description: SUCCESS_MESSAGES.COMMENTS,
  })
  public async getPostComments(
    @Param('postId') postId: string,
    @Query('limit', ParseStringPipe) limit?: number
  ) {
    const comments = await this.feedbackService.getCommentsByPostId(
      postId,
      limit
    );
    return comments.map((comment) =>
      fillDto(CommentRdo, comment.toPlainData())
    );
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
    @Headers() headers: IHeaders
  ) {
    const { sub } = this.jwtService.decode<ITokenPayload>(getToken(headers));
    const newComment = await this.feedbackService.createComment(sub, dto);
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
  public delete(@Param('id') id: string, @Headers() headers: IHeaders) {
    const { sub } = this.jwtService.decode<ITokenPayload>(getToken(headers));
    return this.feedbackService.deleteComment(sub, id);
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
  public like(@Param('postId') postId: string, @Headers() headers: IHeaders) {
    const { sub } = this.jwtService.decode<ITokenPayload>(getToken(headers));
    return this.feedbackService.like(sub, postId);
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
  public unlike(@Param('postId') postId: string, @Headers() headers: IHeaders) {
    const { sub } = this.jwtService.decode<ITokenPayload>(getToken(headers));
    return this.feedbackService.unlike(sub, postId);
  }
}
