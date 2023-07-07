const Card = require("../models/card");
const BadRequest = require("../errors/BadRequestError");
const NotFound = require("../errors/NotFoundError");
const Forbidden = require("../errors/ForbiddenError");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .orFail(() => { throw new NotFound("Передан некорректный id карточки"); })
    .then((card) => {
      if (card.owner === req.user._id) {
        return Card.findByIdAndRemove(req.params.id)
          .then(() => res.status(200).send(card))
          .catch(next);
      }
      throw new Forbidden("Нет доступа удалять карточки других пользователей.");
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequest("Карточка с указанным id не найдена");
      }
      next(err);
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequest("Переданы некорректные данные при создании карточки.");
      }
      next(err);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
  )
    .orFail(() => {
      throw new NotFound("Переданы некоректные данные для постановки лайка");
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequest("Переданы некоректные данные для постановки лайка");
      }
      next(err);
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFound("Переданы некоректные данные для постановки лайка");
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequest("Переданы некоректные данные для постановки лайка");
      }
      next(err);
    })
    .catch(next);
};
