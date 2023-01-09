//this will use the same instance of express created during the main server index.js file
const express = require("express");

const router = express.Router();
const homeController = require(`../controllers/home_controller`);

router.get("/", homeController.home);

module.exports = router;
