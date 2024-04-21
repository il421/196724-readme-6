import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as Joi from 'joi';

@Injectable()
export class DtoValidationPipe<Dto> implements PipeTransform<Dto> {
  constructor(private schema: Joi.ObjectSchema) {}
  public transform(value: Dto): Dto {
    const result = this.schema.validate(value);
    if (result.error) {
      const errorMessages = result.error.details.map((d) => d.message).join();
      throw new BadRequestException(errorMessages);
    }
    return value;
  }
}
