//this will use the same instance of express created during the main server index.js file
const express = require("express");

const router = express.Router();
const postsController = require(`../controllers/posts_controller`);

router.get("/posts", postsController.posts);

module.exports = router;
