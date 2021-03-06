const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// Схема user преобразуем схему в модель и перадаем её в контроллер
// там обрабатываем введенные данные
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => {
        validator.isEmail(value);
      },
      message: 'Не корректный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Неправильные почта или пароль'));
        }
        return user;
      });
    });
};

// Преобразуем схему в модель и экспортируем ===============================
module.exports = mongoose.model('user', userSchema);
