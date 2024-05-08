import { Injectable, PipeTransform } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from '@project/posts-lib';
import { getUniqueTags } from '../../../../../apps/posts/src/app/utils';

@Injectable()
export class TagsTransformPipe implements PipeTransform {
  public transform(
    dto: CreatePostDto | UpdatePostDto
  ): CreatePostDto | UpdatePostDto {
    return { ...dto, tags: getUniqueTags(dto.tags) };
  }
}
