// Для хеширования пароля
const bcrypt = require("bcryptjs");
// Импортируем модуль jsonwebtoken
const jwt = require("jsonwebtoken");
// Импортируем модель
const User = require("../models/userModel");

const ConflictError409 = require("../errors/conflict-err-409");
const UnauthorizedErr401 = require("../errors/unauthorized-err-401");
const BadRequestError400 = require("../errors/bad-request-err-400");

const { NODE_ENV, JWT_SECRET } = process.env;

// Обрабатываем запрос на создание User=====================================
module.exports.createUser = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      return User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      });
    })
    .then(() => {
      return res.status(200).send({
        user: {
          name: req.body.name,
          email: req.body.email,
        },
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError409("Уже существует в базе email"));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
        {
          expiresIn: "7d",
        }
      );

      if (!user) {
        return Promise.reject(new Error("Неправильные почта или пароль"));
      }
      return res.send({ token });
    })

    .catch(() => {
      throw new UnauthorizedErr401("Неправильные почта или пароль");
    })
    .catch(next);
};

// Обрабатываем запрос на получение данных авторизированного Usera =========
module.exports.getAuthUser = (req, res, next) => {
  return User.findById({ _id: req.user._id })
    .then((user) => {
      return res.status(200).send(user);
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
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError400("Переданы невалидные данные"));
      }
      if (err.code === 11000) {
        return next(new ConflictError409("Уже существует в базе email"));
      }
      return next(err);
    });
};
