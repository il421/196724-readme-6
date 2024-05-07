import { Injectable, PipeTransform } from '@nestjs/common';
import { ParseStringPipe } from '@project/data-access';
import { IPaginationQuery } from '@project/core';

@Injectable()
export class CommentsSearchQueryTransformPipe implements PipeTransform {
  public async transform(dto: IPaginationQuery): Promise<IPaginationQuery> {
    const stringPipe = new ParseStringPipe();

    return {
      limit: stringPipe.transform(dto?.limit),
      page: stringPipe.transform(dto?.page),
    };
  }
}
