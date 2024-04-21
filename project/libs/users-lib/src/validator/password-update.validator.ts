import * as Joi from 'joi';
import { UserPasswordConstraints } from './user.constraints';

export const PasswordUpdateValidator = Joi.object({
  password: Joi.string()
    .min(UserPasswordConstraints.Min)
    .max(UserPasswordConstraints.Max)
    .required(),
  newPassword: Joi.string()
    .min(UserPasswordConstraints.Min)
    .max(UserPasswordConstraints.Max)
    .required(),
}).options({
  abortEarly: false,
});
