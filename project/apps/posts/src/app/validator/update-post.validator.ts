import * as Joi from 'joi';
import { CreatePostValidator } from './create-post.validator';
import { PostState } from '@project/core';

export const UpdatePostValidator = CreatePostValidator.append({
  state: Joi.string()
    .valid(...Object.values(PostState))
    .required(),
});
