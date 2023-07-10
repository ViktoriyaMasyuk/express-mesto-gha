const Card = require('../models/card');
const BadRequest = require('../errors/BadRequestError');
const NotFound = require('../errors/NotFoundError');
const Forbidden = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .orFail(() => { throw new NotFound('Передан некорректный id карточки'); })
    .then((card) => {
      if (!(card.owner.toJSON() === req.user._id)) {
        throw new Forbidden('Нет доступа удалять карточки других пользователей.');
      }
      return Card.findByIdAndRemove(req.params.id)
        .then(() => res.status(200).send(card))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Карточка с указанным id не найдена'));
      } else {
        next(err);
      }
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
  )
    .orFail(() => {
      throw new NotFound('Не найдена карточка для постановки лайка');
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некоректные данные для постановки лайка'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFound('Не найдена карточка для удаления лайка');
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некоректные данные для удаления лайка'));
      } else {
        next(err);
      }
    });
};
