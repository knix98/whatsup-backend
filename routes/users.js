const express = require("express");
const router = express.Router();

const passport = require("passport");

const usersController = require("../controllers/users_controller");

router.post("/signup", usersController.signUp);
router.post("/login", usersController.logIn);
router.post(
  "/upload_pic",
  passport.authenticate("jwt", { session: false }),
  usersController.uploadImage,
  usersController.uploadUserPic
);
router.get(
  "/search",
  passport.authenticate("jwt", { session: false }),
  usersController.search
);
router.put(
  "/edit",
  passport.authenticate("jwt", { session: false }),
  usersController.edit
); //{session: false} indicates to passport to not create session cookies, since jwt is used
router.get(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  usersController.profile
);

module.exports = router;
