const router = require("express").Router();

const { validateUpdateData } = require("../middlewares/validations");

const {
  getAuthUser,
  updateUser,
} = require("../controllers/usersController");

// возвращает информацию о пользователе
router.get("/me", getAuthUser);

// обновление данных пользователя
router.patch(
  "/me",
  validateUpdateData,
  updateUser
);

module.exports = router;
