const router = require('express').Router();
const {
  getUsers, getUserId, updateUser, updateAvatar, getMe,
} = require('../controllers/users');
const { validationUpdateAvatar, validationUpdateUser, validationUserId } = require('../middlewares/validation');

router.get('/users/me', getMe);
router.get('/users/:id', validationUserId, getUserId);
router.patch('/users/me', validationUpdateUser, updateUser);
router.patch('/users/me/avatar', validationUpdateAvatar, updateAvatar);
router.get('/users', getUsers);

module.exports = router;
