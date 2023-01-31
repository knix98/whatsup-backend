const express = require("express");
const router = express.Router();

const passport = require("passport");

const likesController = require("../controllers/likes_controller");

router.post(
  "/toggle",
  passport.authenticate("jwt", { session: false }),
  likesController.toggleLike
);

module.exports = router;
