const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
require("dotenv").config();
const { requestLogger, errorLogger } = require("./middlewares/logger");
const routers = require("./routes/indexRoutes");

const { PORT = 3001 } = process.env;

const app = express();

const options = {
  origin: [
    "http://localhost:3001",
    "http://films.nomoredomains.rocks",
    "https://films.nomoredomains.rocks",
  ],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ["Content-Type", "origin", "Authorization"],
};

app.use(cors(options)); // обработка cors
app.use(express.json());
app.use(routers); // подключаем роуты
app.use(requestLogger); // подключаем логгер запросов
app.use(errors()); // обработчик ошибок celebrate
app.use(errorLogger); // подключаем логгер ошибок
app.use(express.urlencoded({ extended: true }));
// подключаемся к серверу mongo
mongoose.connect("mongodb://localhost:27017/filmsdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// обработчик ошибок =======================================================
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
  next();
});

// запуск сервера ==========================================================
app.listen(PORT, () => {
  console.log(`Сервер работает и готов к получению данных на ${PORT} port...`);
});
