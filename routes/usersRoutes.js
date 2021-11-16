const { celebrate, Joi } = require("celebrate");
const validator = require("validator");

const router = require("express").Router();

const {
  getUser,
  updateUser,
} = require("../controllers/usersController");


// возвращает информацию о пользователе
router.get("/me", getUser);

// обновление данных пользователя
router.patch(
  "/me",
  celebrate({
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
  }),
  updateUser
);

module.exports = router;



/*
# возвращает информацию о пользователе(email и имя)
GET / users / me

# обновляет информацию о пользователе(email и имя)
PATCH / users / me

# возвращает все сохранённые пользователем фильмы
GET / movies

# создаёт фильм с переданными в теле
# country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId
POST / movies

# удаляет сохранённый фильм по id
DELETE / movies / movieId
*/