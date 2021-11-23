const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
require('dotenv').config();
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/indexRoutes');
const errorHendler = require('./middlewares/errorHendler');
const { MONGO_URL } = require('./utils/config');

const { PORT = 3002 } = process.env;

const app = express();

const options = {
  origin: [
    'http://films.nomoredomains.rocks',
    'https://films.nomoredomains.rocks',
    'http://localhost:3001',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
};

app.use(cors(options)); // обработка cors
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// подключаемся к серверу mongo
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger); // подключаем логгер запросов

app.use(router); // подключаем роуты

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate

// обработчик ошибок =======================================================
app.use(errorHendler);

// запуск сервера ==========================================================
app.listen(PORT, () => {
  console.log(`Сервер работает и готов к получению данных на ${PORT} port...`);
});
