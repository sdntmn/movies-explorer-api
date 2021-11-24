const validator = require('validator');

const mongoose = require('mongoose');

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
        validator.isURL(value);
      },
      message: 'Не корректный URL',
    },
  },
  trailer: {
    type: String,
    validate: {
      validator: (value) => {
        validator.isURL(value);
      },
      message: 'Не корректный URL',
    },
  },
  thumbnail: {
    type: String,
    validate: {
      validator: (value) => {
        validator.isURL(value);
      },
      message: 'Не корректный URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

// Преобразуем схему в модель и экспортируем ===============================
module.exports = mongoose.model('movie', movieSchema);
