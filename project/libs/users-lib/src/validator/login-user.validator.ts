import * as Joi from 'joi';
import { UserPasswordConstraints } from './user.constraints';

export const LoginUserValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(UserPasswordConstraints.Min)
    .max(UserPasswordConstraints.Max)
    .required(),
}).options({
  abortEarly: false,
});
