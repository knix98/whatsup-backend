const express = require("express");
const router = express.Router();

const passport = require("passport");

const commentsController = require("../controllers/comments_controller");

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  commentsController.createComment
);

router.delete(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  commentsController.deleteComment
);

module.exports = router;
