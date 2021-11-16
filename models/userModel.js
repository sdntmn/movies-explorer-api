const validator = require("validator");
const bcrypt = require("bcryptjs");

const mongoose = require("mongoose");

// Схема user преобразуем схему в модель и перадаем её в контроллер
// там обрабатываем введенные данные
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value);
      },
      message: "Не корректный email",
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      default: "Александр",
      minlength: 2,
      maxlength: 30,
    },
  }
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Неправильные почта или пароль"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Неправильные почта или пароль"));
        }

        return user;
      });
    });
};

// Преобразуем схему в модель и экспортируем ===============================
module.exports = mongoose.model("user", userSchema);