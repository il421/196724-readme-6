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
  public transform<T extends unknown = string | string[] | undefined>(
    value: T,
    { type }: ArgumentMetadata
  ) {
    if (type === 'body') {
      throw new BadRequestException(ERROR_MESSAGES.PIPE);
    }

    if (typeof value === 'undefined') return undefined;

    const isValueValid: boolean = Array.isArray(value)
      ? value.every((v) => Types.ObjectId.isValid(v))
      : Types.ObjectId.isValid(value as string);

    if (!isValueValid) {
      throw new BadRequestException(ERROR_MESSAGES.BAD_MONGO_ID_ERROR);
    }

    return value;
  }
}
