import * as Joi from 'joi';
import {
  UserNameConstraints,
  UserPasswordConstraints,
} from './user.constraints';

export const CreateUserValidator = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string()
    .min(UserNameConstraints.Min)
    .max(UserNameConstraints.Max)
    .required(),
  lastName: Joi.string()
    .min(UserNameConstraints.Min)
    .max(UserNameConstraints.Max)
    .required(),
  password: Joi.string()
    .min(UserPasswordConstraints.Min)
    .max(UserPasswordConstraints.Max)
    .required(),
}).options({
  abortEarly: false,
});
