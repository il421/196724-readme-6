import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  HttpStatus,
  UseGuards,
  Headers,
} from '@nestjs/common';
import {
  ERROR_MESSAGES,
  IHeaders,
  ITokenPayload,
  SUCCESS_MESSAGES,
  SWAGGER_TAGS,
} from '@project/core';
import { CreateSubscriptionDto } from './dtos';
import { fillDto, getToken } from '@project/helpers';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionRdo } from './rdos';
import { SubscriptionsPaths } from './subscriptions-paths.enum';
import { JwtAuthGuard } from '@project/data-access';
import { JwtService } from '@nestjs/jwt';

@ApiTags(SWAGGER_TAGS.SUBSCRIPTIONS)
@ApiBearerAuth()
@Controller(SubscriptionsPaths.Base)
export class SubscriptionsController {
  constructor(
    private readonly subscriptionService: SubscriptionsService,
    private readonly jwtService: JwtService
  ) {}

  @Get(SubscriptionsPaths.Subscriptions)
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
  public async getSubscriptions(@Headers() headers: IHeaders) {
    const { sub } = this.jwtService.decode<ITokenPayload>(getToken(headers));
    const subscription = await this.subscriptionService.find(sub);
    return subscription.map((subscription) =>
      fillDto(SubscriptionRdo, subscription.toPlainData())
    );
  }

  @Post(SubscriptionsPaths.Create)
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
  public async subscribe(
    @Body() dto: CreateSubscriptionDto,
    @Headers() headers: IHeaders
  ) {
    const { sub } = this.jwtService.decode<ITokenPayload>(getToken(headers));
    const newSubscription = await this.subscriptionService.create(sub, dto);
    return fillDto(SubscriptionRdo, newSubscription.toPlainData());
  }

  @Delete(SubscriptionsPaths.Delete)
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
  public unsubscribe(
    @Param('authorId') authorId: string,
    @Headers() headers: IHeaders
  ) {
    const { sub } = this.jwtService.decode<ITokenPayload>(getToken(headers));
    return this.subscriptionService.delete(sub, authorId);
  }
}
