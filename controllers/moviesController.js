// Импортируем модель user из ../models/user
const Movie = require("../models/movieModel");
const NotFoundError404 = require("../errors/not-found-err-404");
const ForbiddenErr403 = require("../errors/forbidden-err-403");

// Обрабатываем запрос на получение данных всех Cards ======================
module.exports.getMovies = (req, res, next) => {
  return Movie.find({})
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(next);
};

// +Обрабатываем запрос на удаление Movie ===================================
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      return next(new NotFoundError404("Фильм с указанным _id не найден!!!."));
    })
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        return next(new ForbiddenErr403("Нельзя удалять чужие фильмы из избранного"));
      }
      return Movie.deleteOne(movie).then(() => {
        res.send({ data: movie });
      });
    })
    .catch(next);
};

// Обрабатываем запрос на сохранение фильма ================================
module.exports.saveMovies = (req, res, next) => {
  return Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => {
      return res.status(200).send(movie);
    })
    .catch(next);
};
