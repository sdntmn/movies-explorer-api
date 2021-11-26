const router = require('express').Router();
const { validateLoginData, validateCreateUser } = require('../middlewares/validations');
const userRouter = require('./usersRoutes');
const moviesRouter = require('./moviesRoutes');
const auth = require('../middlewares/auth');
const NotFoundError404 = require('../errors/not-found-err-404');
const { createUser, login } = require('../controllers/usersController');

// роуты без авторизации
router.post(
  '/signin',
  validateLoginData,
  login,
);

router.post(
  '/signup',
  validateCreateUser,
  createUser,
);

// роуты с авторизацией
router.use('/users', auth, userRouter);
router.use('/movies', auth, moviesRouter);
router.all('*', auth, (req, res, next) => {
  next(new NotFoundError404('Маршрут не найден'));
});

module.exports = router;
