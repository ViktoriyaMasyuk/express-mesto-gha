const router = require("express").Router();
const {
  getUsers, getUserId, updateUser, updateAvatar,
} = require("../controllers/users");

router.get("/users", getUsers);
router.get("/users/:id", getUserId);
router.patch("/users/me", updateUser);
router.patch("/users/me/avatar", updateAvatar);

module.exports = router;
