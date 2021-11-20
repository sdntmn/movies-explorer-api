const { celebrate, Joi } = require("celebrate");
const validator = require("validator");

module.exports.validateUpdateData = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value) => {
      if (!validator.isEmail(value, { require_protocol: true })) {
        throw new Error("Не корректный email");
      } else {
        return value;
      }
    }),
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports.validateLoginData = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.validateSaveMovies = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().integer(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string()
      .required()
      .custom((value) => {
        if (!validator.isURL(value, { require_protocol: true })) {
          throw new Error("Неправильный формат ссылки");
        } else {
          return value;
        }
      }),
    trailerLink: Joi.string()
      .required()
      .custom((value) => {
        if (!validator.isURL(value, { require_protocol: true })) {
          throw new Error("Неправильный формат ссылки");
        } else {
          return value;
        }
      }),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string()
      .required()
      .custom((value) => {
        if (!validator.isURL(value, { require_protocol: true })) {
          throw new Error("Неправильный формат ссылки");
        } else {
          return value;
        }
      }),
    movieId: Joi.number().integer(),
  }),
});

module.exports.validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  })
});
