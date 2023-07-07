const router = require("express").Router();
const {
  getUsers, getUserId, updateUser, updateAvatar,
} = require("../controllers/users");
const { validationUpdateAvatar } = require("../middlewares/validation");

router.get("/users", getUsers);
router.get("/users/:id", getUserId);
router.patch("/users/me", updateUser);
router.patch("/users/me/avatar", validationUpdateAvatar, updateAvatar);

module.exports = router;
