const router = require("express").Router();
const {
  getUsers, getUserId, updateUser, updateAvatar, getMe,
} = require("../controllers/users");
const { validationUpdateAvatar } = require("../middlewares/validation");

router.get("/users/me", getMe);
router.get("/users/:id", getUserId);
router.patch("/users/me", updateUser);
router.patch("/users/me/avatar", validationUpdateAvatar, updateAvatar);
router.get("/users", getUsers);

module.exports = router;
