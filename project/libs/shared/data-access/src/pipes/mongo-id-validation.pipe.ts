import { Types } from 'mongoose';
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ERROR_MESSAGES } from '@project/core';

@Injectable()
export class MongoIdValidationPipe implements PipeTransform {
  public transform(value: string, { type }: ArgumentMetadata) {
    if (type !== 'param') {
      throw new Error('This pipe must used only with params!');
    }

    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(ERROR_MESSAGES.BAD_MONGO_ID_ERROR);
    }

    return value;
  }
}
