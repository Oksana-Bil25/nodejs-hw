import { isHttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  // Перевірка, чи є помилка екземпляром HttpError (наприклад, 404, 401)
  if (isHttpError(err)) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
    });
  }

  // Обробка всіх інших помилок (статус 500)
  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
};
