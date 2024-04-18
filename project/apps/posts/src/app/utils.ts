import { unique } from '@project/helpers';

export const getUniqueTags = (tags: string[] | undefined) =>
  unique(tags?.map((tag) => tag.trim().toLowerCase()));
