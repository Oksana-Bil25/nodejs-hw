import { celebrate, Joi } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

// Кастомна валідація для MongoDB ObjectId
const objectId = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

// Валідація для GET /notes
export const getAllNotesSchema = celebrate({
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string()
      .valid(...TAGS)
      .optional(),
    search: Joi.string().allow('').optional(),
  }),
});

// Валідація для GET /notes/:noteId та DELETE /notes/:noteId
export const noteIdSchema = celebrate({
  params: Joi.object({
    noteId: Joi.string().custom(objectId).required().messages({
      'any.invalid': 'Invalid note ID format',
    }),
  }),
});

// Валідація для POST /notes
export const createNoteSchema = celebrate({
  body: Joi.object({
    title: Joi.string().min(1).required(),
    content: Joi.string().allow('').optional(),
    tag: Joi.string()
      .valid(...TAGS)
      .optional(),
  }),
});

// Валідація для PATCH /notes/:noteId
export const updateNoteSchema = celebrate({
  params: Joi.object({
    noteId: Joi.string().custom(objectId).required().messages({
      'any.invalid': 'Invalid note ID format',
    }),
  }),
  body: Joi.object({
    title: Joi.string().min(1).optional(),
    content: Joi.string().allow('').optional(),
    tag: Joi.string()
      .valid(...TAGS)
      .optional(),
  })
    .min(1)
    .messages({
      'object.min': 'At least one field must be provided',
    }),
});
