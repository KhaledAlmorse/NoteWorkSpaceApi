import Joi from "joi";
import { isValidObjectId } from "../../Middlware/validation.middlware.js";

export const CreateNoteValidation = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  content: Joi.string().min(1).required(),
  category: Joi.string()
    .valid("personal", "work", "study", "other")
    .default("other"),
  tags: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid("active", "archived").default("active"),
  isPinned: Joi.boolean().default(false),
});

export const UpdateNoteValidation = Joi.object({
  id: Joi.string().required().custom(isValidObjectId),
  title: Joi.string().min(3).max(100).optional(),
  content: Joi.string().min(1).optional(),
  category: Joi.string().valid("personal", "work", "study", "other").optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid("active", "archived").optional(),
  isPinned: Joi.boolean().optional(),
});
