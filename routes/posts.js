const express = require("express");
const router = express.Router();

const passport = require("passport");

const postsController = require("../controllers/posts_controller");

router.get("/getposts", postsController.posts);
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  postsController.createPost
);

module.exports = router;
