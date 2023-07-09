const router = require('express').Router();
const {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { validationCardId, validationCreateCard } = require('../middlewares/validation');

router.get('/cards', validationCardId, getCards);
router.delete('/cards/:id', validationCardId, deleteCard);
router.post('/cards', validationCreateCard, createCard);
router.put('/cards/:id/likes', validationCardId, likeCard);
router.delete('/cards/:id/likes', validationCardId, dislikeCard);
module.exports = router;
