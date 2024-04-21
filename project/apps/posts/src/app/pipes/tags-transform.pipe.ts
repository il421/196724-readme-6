import { Injectable, PipeTransform } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from '../dtos';
import { getUniqueTags } from '../utils';

@Injectable()
export class TagsTransformPipe implements PipeTransform {
  public transform(
    dto: CreatePostDto | UpdatePostDto
  ): CreatePostDto | UpdatePostDto {
    return { ...dto, tags: getUniqueTags(dto.tags) };
  }
}
