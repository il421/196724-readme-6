import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  HttpStatus,
} from '@nestjs/common';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, SwaggerTags } from '@project/core';
import { CreateSubscriptionDto } from './dtos';
import { fillDto } from '@project/helpers';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionRdo } from './rdos';
import { SubscriptionsPaths } from './subscriptions-paths.enum';

@ApiTags(SwaggerTags.Subscriptions)
@Controller(SubscriptionsPaths.Base)
export class SubscriptionsController {
  constructor(private readonly subscriptionService: SubscriptionsService) {}

  @Get(SubscriptionsPaths.Subscriptions)
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
  public async getSubscriptions(@Param('userId') userId: string) {
    // @TODO need to get userId from token
    const subscription = await this.subscriptionService.find(userId);
    return subscription.map((subscription) =>
      fillDto(SubscriptionRdo, subscription.toPlainData())
    );
  }

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
  @Post(SubscriptionsPaths.Create)
  public async subscribe(
    @Param('userId') userId: string,
    @Body() dto: CreateSubscriptionDto
  ) {
    // @TODO need to get userId from token
    const newSubscription = await this.subscriptionService.create(userId, dto);
    return fillDto(SubscriptionRdo, newSubscription.toPlainData());
  }

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
  @Delete(SubscriptionsPaths.Delete)
  public async unsubscribe(
    @Param('userId') userId: string,
    @Param('authorId') authorId: string
  ) {
    // @TODO need to get userId from token
    return await this.subscriptionService.delete(userId, authorId);
  }
}
