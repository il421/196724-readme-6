import { PostTypes } from '@project/core';
import { TextPostRdo } from './text-post.rdo';
import { PhotoPostRdo } from './photo-post.rdo';
import { QuotePostRdo } from './quote-post.rdo';
import { VideoPostRdo } from './video-post.rdo';
import { RefPostRdo } from './ref-post.rdo';
import { BasePostRdo } from './base-post.rdo';

export const withPostRdo = (type?: PostTypes) => {
  switch (type) {
    case PostTypes.Text:
      return TextPostRdo;
    case PostTypes.Photo:
      return PhotoPostRdo;
    case PostTypes.Quote:
      return QuotePostRdo;
    case PostTypes.Video:
      return VideoPostRdo;
    case PostTypes.Ref:
      return RefPostRdo;
    default:
      return BasePostRdo;
  }
};
