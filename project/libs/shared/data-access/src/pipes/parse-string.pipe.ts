import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ERROR_MESSAGES } from '@project/core';

@Injectable()
export class ParseStringPipe implements PipeTransform {
  public transform(value: string | number | undefined): number | undefined {
    if (typeof value === 'undefined') return value;
    const isValidNumber = !isNaN(Number(value));
    if (!isValidNumber)
      throw new BadRequestException(value, ERROR_MESSAGES.INVALID_QUERY_PARAM);
    return Number(value);
  }
}
