// Для хеширования пароля
const bcrypt = require('bcryptjs');
// Импортируем модуль jsonwebtoken
const jwt = require('jsonwebtoken');
// Импортируем модель
const User = require('../models/userModel');

const { JWT_KEY } = require('../utils/config');

const ConflictError409 = require('../errors/conflict-err-409');
const UnauthorizedErr401 = require('../errors/unauthorized-err-401');
const BadRequestError400 = require('../errors/bad-request-err-400');

// Обрабатываем запрос на создание User=====================================
module.exports.createUser = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then(() => {
      res.status(201).send({
        user: {
          name: req.body.name,
          email: req.body.email,
        },
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError409('Уже существует в базе email'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      const token = jwt.sign(
        { _id: user._id },
        JWT_KEY,
        {
          expiresIn: '7d',
        },
      );
      return res.send({ token });
    })

    .catch(() => {
      throw new UnauthorizedErr401('Неправильные почта или пароль');
    })
    .catch(next);
};

// Обрабатываем запрос на получение данных авторизированного Usera =========
module.exports.getAuthUser = (req, res, next) => {
  User.findById({ _id: req.user._id })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

// Обрабатываем запрос на обновление данных User ===========================
module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError400('Переданы невалидные данные'));
      }
      if (err.code === 11000) {
        return next(new ConflictError409('Уже существует в базе email'));
      }
      return next(err);
    });
};
