import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, SWAGGER_TAGS } from '@project/core';
import { CreateSubscriptionDto } from './dtos';
import { fillDto } from '@project/helpers';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionRdo } from './rdos';
import { JwtAuthGuard, SUBSCRIPTIONS_PATHS } from '@project/data-access';
import { RequestWithUser } from '@project/users-lib';

@ApiTags(SWAGGER_TAGS.SUBSCRIPTIONS)
@ApiBearerAuth()
@Controller(SUBSCRIPTIONS_PATHS.BASE)
export class SubscriptionsController {
  constructor(private readonly subscriptionService: SubscriptionsService) {}

  @Get(SUBSCRIPTIONS_PATHS.SUBSCRIPTIONS)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: SubscriptionRdo,
    description: SUCCESS_MESSAGES.SUBSCRIPTIONS,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGES.USER_NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ERROR_MESSAGES.UNAUTHORIZED,
  })
  public async find(@Req() { user }: RequestWithUser) {
    const subscription = await this.subscriptionService.find(user.id);
    return subscription.map((subscription) =>
      fillDto(SubscriptionRdo, subscription.toPlainData())
    );
  }

  @Post(SUBSCRIPTIONS_PATHS.CREATE)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SubscriptionRdo,
    description: SUCCESS_MESSAGES.SUBSCRIBED,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGES.USER_NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: ERROR_MESSAGES.SUBSCRIPTION_EXISTS,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ERROR_MESSAGES.UNAUTHORIZED,
  })
  public async subscribe(
    @Body() dto: CreateSubscriptionDto,
    @Req() { user }: RequestWithUser
  ) {
    const newSubscription = await this.subscriptionService.create(user.id, dto);
    return fillDto(SubscriptionRdo, newSubscription.toPlainData());
  }

  @Delete(SUBSCRIPTIONS_PATHS.DELETE)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: SUCCESS_MESSAGES.UNSUBSCRIBED,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGES.SUBSCRIPTION_NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGES.USER_NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ERROR_MESSAGES.UNAUTHORIZED,
  })
  public unsubscribe(
    @Param('authorId') authorId: string,
    @Req() { user }: RequestWithUser
  ) {
    return this.subscriptionService.delete(user.id, authorId);
  }
}
