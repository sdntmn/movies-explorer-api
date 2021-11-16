const validator = require("validator");

const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    validate: {
      validator: (value) => {
        return validator.isURL(value);
      },
      message: "Не корректный URL",
    },
  },
  trailer: {
    type: String,
    validate: {
      validator: (value) => {
        return validator.isURL(value);
      },
      message: "Не корректный URL",
    },
  },
  thumbnail: {
    type: String,
    validate: {
      validator: (value) => {
        return validator.isURL(value);
      },
      message: "Не корректный URL",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    nameEN: true,
  }, description: {
    type: String,
    required: true,
  },
});

// Преобразуем схему в модель и экспортируем ===============================
module.exports = mongoose.model("movie", movieSchema);

/* country — страна создания фильма. Обязательное поле-строка.
director — режиссёр фильма. Обязательное поле-строка.
duration — длительность фильма. Обязательное поле-число.
year — год выпуска фильма. Обязательное поле-строка.
description — описание фильма. Обязательное поле-строка.
image — ссылка на постер к фильму. Обязательное поле-строка. Запишите её URL-адресом.
trailer — ссылка на трейлер фильма. Обязательное поле-строка. Запишите её URL-адресом.
thumbnail — миниатюрное изображение постера к фильму. Обязательное поле-строка. Запишите её URL-адресом.
owner — _id пользователя, который сохранил фильм. Обязательное поле.
movieId — id фильма, который содержится в ответе сервиса MoviesExplorer. Обязательное поле.
nameRU — название фильма на русском языке. Обязательное поле-строка.
nameEN — название фильма на английском языке. Обязательное поле-строка.
*/