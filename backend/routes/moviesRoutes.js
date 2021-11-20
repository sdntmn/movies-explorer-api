const router = require("express").Router();

const { validateSaveMovies, validateDeleteMovie } = require("../middlewares/validations");

const {
  getMovies,
  saveMovies,
  deleteMovie,
} = require("../controllers/moviesController");

// Все сохранённые пользователем фильмы ====================================
router.get("/", getMovies);

// Сохранение фильма =======================================================
router.post(
  "/",
  validateSaveMovies,
  saveMovies
);

// Удаление фильма из сохраненных ==========================================
router.delete(
  "/:movieId",
  validateDeleteMovie,
  deleteMovie
);

module.exports = router;
