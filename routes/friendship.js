const express = require("express");
const router = express.Router();

const passport = require("passport");

const friendshipController = require("../controllers/friendship_controller");

router.post(
  "/create_friendship",
  passport.authenticate("jwt", { session: false }),
  friendshipController.addFriend
);
router.post(
  "/remove_friendship",
  passport.authenticate("jwt", { session: false }),
  friendshipController.removeFriend
);

module.exports = router;
