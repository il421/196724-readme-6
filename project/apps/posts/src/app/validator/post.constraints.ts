export enum PostTitleConstraints {
  Min = 20,
  Max = 50,
}

export enum PostTextConstraints {
  Min = 100,
  Max = 1024,
}

export enum PostAnnouncementConstraints {
  Min = 50,
  Max = 255,
}

export enum PostQuoteTextConstraints {
  Min = 20,
  Max = 300,
}

export enum PostQuoteAuthorConstraints {
  Min = 3,
  Max = 50,
}

export enum PostTagConstraints {
  Min = 3,
  Max = 10,
  length = 8,
}

export enum PostRefDescriptionConstraints {
  Max = 300,
}

export const ONE_WORD_REG_EX = /^\S*$/;
export const ONE_WORD_ALLOWED_VALIDATION_MESSAGE = 'One word allowed only';
