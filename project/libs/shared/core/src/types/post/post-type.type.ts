export const PostType = {
  Video: 'video',
  Text: 'text',
  Quote: 'quote',
  Photo: 'photo',
  Ref: 'ref',
} as const;

export type PostType = (typeof PostType)[keyof typeof PostType];
