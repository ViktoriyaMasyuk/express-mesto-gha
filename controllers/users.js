const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const BadRequest = require("../errors/BadRequestError");
const Conflict = require("../errors/ConflictError");
const NotFound = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");

// поиск всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequest("Переданы некорректные данные при создании пользователя.");
      }
      next(err);
    })
    .catch(next);
};

// поиск пользователя по id
module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => { throw new NotFound("Пользователь с указанным _id не найден."); })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequest("Указан некоректный id. ");
      }
      next(err);
    })
    .catch(next);
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => { throw new NotFound("Пользователь с указанным _id не найден."); })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequest("Указан некоректный id. ");
      }
      next(err);
    })
    .catch(next);
};

// создание пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequest("Переданы некорректные данные при создании пользователя. ");
      }
      if (err.code === 11000) {
        throw new Conflict("Пользователь с таким email уже существует");
      }
      next(err);
    })
    .catch(next);
};

// обновление данных пользователя
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequest("Переданы некорректные данные при обновлении профиля.");
      }
      err(next);
    })
    .catch(next);
};

// обновление аватара
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequest("Переданы некорректные данные при обновлении аватара.");
      }
      err(next);
    })
    .catch(next);
};

// аутентификация пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "super-strong-secret", { expiresIn: "7d" });
      res.send({ token });
    })
    .catch(() => {
      throw new UnauthorizedError("Неверно указаны почта или пароль");
    })
    .catch(next);
};
