import {
  ArgumentMetadata,
  Injectable,
  ParseArrayPipe,
  PipeTransform,
} from '@nestjs/common';
import { SearchPostsQuery } from '../serach-post.query';
import { MongoIdValidationPipe } from '@project/data-access';
import { PARSE_QUERY_ARRAY_PIPE_OPTIONS } from '../post.constants';

@Injectable()
export class PostSearchQueryTransformPipe implements PipeTransform {
  public async transform(
    dto: SearchPostsQuery,
    metadata: ArgumentMetadata
  ): Promise<SearchPostsQuery> {
    const arrayPipe = new ParseArrayPipe(PARSE_QUERY_ARRAY_PIPE_OPTIONS);
    const mongoIdValidationPipe = new MongoIdValidationPipe();

    return {
      ...dto,
      tags: await arrayPipe.transform(dto?.tags ?? [], metadata),
      usersIds: mongoIdValidationPipe.transform(dto?.usersIds ?? [], metadata),
      types: await arrayPipe.transform(dto?.types ?? [], metadata),
      limit:
        dto?.limit && !isNaN(Number(dto.limit)) ? Number(dto.limit) : undefined,
      page:
        dto?.page && !isNaN(Number(dto.page)) ? Number(dto.page) : undefined,
    };
  }
}
