//this will use the same instance of express created during the main server index.js file
const express = require("express");

const router = express.Router();

router.use("/posts", require("./posts"));
router.use("/users", require("./users"));
router.use("/friendship", require("./friendship"));

module.exports = router;
