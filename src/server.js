import express from "express";
import cors from "cors";
import pino from "pino-http";
import dotenv from "dotenv";

// Завантаження змінних оточення
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Налаштування логера
const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Маршрут для отримання всіх нотаток
app.get("/notes", (req, res) => {
  res.status(200).json({
    message: "Retrieved all notes",
  });
});

// Маршрут для отримання однієї нотатки за ID
app.get("/notes/:noteId", (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

// Тестовий маршрут для імітації помилки
app.get("/test-error", () => {
  throw new Error("Simulated server error");
});

// Middleware для обробки неіснуючих маршрутів (404)
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Middleware для обробки помилок (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message,
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
