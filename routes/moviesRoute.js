const { celebrate, Joi } = require("celebrate");
const validator = require("validator");

const router = require("express").Router();

const {
  getMovies,
  createMovies,
  deleteMovies,
} = require("../controllers/moviesController");

router.get("/", getMovies);

router.post(
  "/",
  celebrate({
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
      trailer: Joi.string()
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
  }),
  createMovies
);

// Удаление карточки =======================================================
router.delete(
  "/:moviesId",
  celebrate({
    params: Joi.object().keys({
      moviesId: Joi.number().integer()
    }),
  }),
  deleteMovies
);

module.exports = router;
