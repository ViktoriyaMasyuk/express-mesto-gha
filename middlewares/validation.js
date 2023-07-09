const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const BadRequest = require('../errors/BadRequestError');

const validationUrl = (url) => {
  if (validator.isURL(url)) {
    return url;
  }
  throw new BadRequest('Некорректный URL');
};

module.exports.validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validationUrl),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.validationUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validationUrl),
  }),
});

module.exports.validationUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

module.exports.validationUserId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
});

module.exports.validationCardId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
});

module.exports.validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().custom(validationUrl),
  }),
});
