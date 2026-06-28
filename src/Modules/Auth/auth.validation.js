import joi from "joi";
import { isValidObjectId } from "../../Middlware/validation.middlware.js";

export const RegisterValidation = joi
  .object({
    userName: joi.string().required().min(3).max(30),
    email: joi.string().email().required(),
    password: joi.string().required().min(6).max(30),
    confirmPassword: joi
      .string()
      .required()
      .valid(joi.ref("password"))
      .messages({
        "any.only": "Confirm Password must match Password",
      }),
  })
  .required();

export const LoginValidation = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().required().min(6).max(30),
  })
  .required();

export const UpdateUserValidation = joi
  .object({
    userName: joi.string().min(3).max(30),
    email: joi.string().email(),
  })
  .required();
