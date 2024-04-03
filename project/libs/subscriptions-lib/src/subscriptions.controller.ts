import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { OpenApiTags, RoutePaths } from '@project/core';
import { CreateSubscriptionDto } from './dtos';
import { fillDto } from '@project/helpers';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionRdo } from './rdos';

@ApiTags(OpenApiTags.Subscriptions)
@ApiExtraModels(SubscriptionRdo)
@ApiBearerAuth()
@Controller(RoutePaths.Subscriptions)
export class SubscriptionsController {
  constructor(private readonly subscriptionService: SubscriptionsService) {}

  @Get('/')
  public async getSubscriptions() {
    const subscription = await this.subscriptionService.find('id'); // @TODO need to get it from token
    // @TODO need to get posts by publishedBy from posts service
    return subscription.map((subscription) =>
      fillDto(SubscriptionRdo, subscription.toPlainData())
    );
  }

  @Post('create')
  public async subscribe(@Body() dto: CreateSubscriptionDto) {
    const newSubscription = await this.subscriptionService.create(dto);
    return fillDto(SubscriptionRdo, newSubscription.toPlainData());
  }

  @Delete('delete')
  public async unsubscribe(@Param('publisherId') publisherId: string) {
    return await this.subscriptionService.delete(publisherId);
  }
}
