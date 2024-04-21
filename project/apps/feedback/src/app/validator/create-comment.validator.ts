import * as Joi from 'joi';
import { CommentConstraints } from './comment.constraints';

export const CreateCommentValidator = Joi.object({
  text: Joi.string()
    .min(CommentConstraints.Min)
    .max(CommentConstraints.Max)
    .required(),
}).options({
  abortEarly: false,
});
