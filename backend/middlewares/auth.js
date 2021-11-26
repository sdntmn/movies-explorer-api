// импортируем модуль jsonwebtoken
const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../utils/config');

const UnauthorizedErr401 = require('../errors/unauthorized-err-401');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ') || authorization === undefined) {
    return next(new UnauthorizedErr401('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      JWT_KEY,
    );
  } catch (err) {
    return next(new UnauthorizedErr401('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
