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
import { CreateSubscriptionDto } from './dtos';
import { fillDto } from '@project/helpers';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionRdo } from './rdos';

@ApiTags(OpenApiTags.Subscriptions)
@Controller(RoutePaths.Subscriptions)
export class SubscriptionsController {
  constructor(private readonly subscriptionService: SubscriptionsService) {}

  @Get('/:userId')
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: SubscriptionRdo,
    description: SuccessMessages.Subscriptions,
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
    description: SuccessMessages.Subscribed,
  })
  @Post(':userId/create')
  public async subscribe(
    @Param('userId') userId: string,
    @Body() dto: CreateSubscriptionDto
  ) {
    // @TODO need to get userId from token
    const newSubscription = await this.subscriptionService.create(userId, dto);
    return fillDto(SubscriptionRdo, newSubscription.toPlainData());
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: SuccessMessages.Unsubscribed,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ErrorMessages.SubscriptionNotFound,
  })
  @Delete(':userId/delete/:authorId')
  public async unsubscribe(
    @Param('userId') userId: string,
    @Param('authorId') authorId: string
  ) {
    // @TODO need to get userId from token
    return await this.subscriptionService.delete(userId, authorId);
  }
}
