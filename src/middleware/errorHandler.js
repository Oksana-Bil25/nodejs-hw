import { isHttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  // Перевірка, чи є помилка екземпляром HttpError
  if (isHttpError(err)) {
    return res.status(err.status).json({
      message: err.message, // Тільки message
    });
  }

  // Обробка всіх інших помилок (статус 500)
  res.status(500).json({
    message: 'Something went wrong', // Тільки message
  });
};
