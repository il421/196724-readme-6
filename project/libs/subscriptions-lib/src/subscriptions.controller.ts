import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  HttpStatus,
} from '@nestjs/common';
import { OpenApiTags, RoutePaths } from '@project/core';
import { CreateSubscriptionDto } from './dtos';
import { fillDto } from '@project/helpers';
import {
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionRdo } from './rdos';

@ApiTags(OpenApiTags.Subscriptions)
@ApiExtraModels(SubscriptionRdo)
@Controller(RoutePaths.Subscriptions)
export class SubscriptionsController {
  constructor(private readonly subscriptionService: SubscriptionsService) {}

  @Get('/')
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    schema: {
      $ref: getSchemaPath(SubscriptionRdo),
    },
  })
  public async getSubscriptions() {
    const subscription = await this.subscriptionService.find('id'); // @TODO need to get it from token
    // @TODO need to get posts by publishedBy from posts service
    return subscription.map((subscription) =>
      fillDto(SubscriptionRdo, subscription.toPlainData())
    );
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      $ref: getSchemaPath(SubscriptionRdo),
    },
  })
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
