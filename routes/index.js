const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const { validationLogin, validationCreateUser } = require('../middlewares/validation');
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signin', validationLogin, login);
router.post('/signup', validationCreateUser, createUser);

router.use(auth);
router.use('/', userRouter);
router.use('/', cardRouter);

router.use((req, res, next) => {
  if (req.accepts('json')) {
    next(new NotFoundError('Страница не найдена'));
  }
  next();
});

module.exports = router;
