import { Joi } from 'celebrate';

// Реєстрація
export const registerUserSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};

// Логін
export const loginUserSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

// Запит на скидання пароля
export const requestResetEmailSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};

// Скидання пароля
export const resetPasswordSchema = {
  body: Joi.object({
    password: Joi.string().min(8).required(),
    token: Joi.string().required(),
  }),
};
