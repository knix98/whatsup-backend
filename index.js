const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 7000;

const passport = require("passport");
//important to require all the passport configurations of diff strategies here in main index.js, so that the config code runs immediately as the server starts
const passportJWT = require("./config/passport-jwt-strategy");

const env = require("./config/environment");
require("./config/mongoose"); //code for setting up connection(using mongoose) to our db(MongoDb) running in the background

// bodyParser.urlencoded returns middleware that only parses urlencoded bodies(and not json bodies)
//or in other words: looks at requests where the Content-Type header matches the type option
//A new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body).
//This object will contain key-value pairs, where the value can be a string or array (when extended is false), or any type (when extended is true).
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize()); //init passport on every route call

//keeping the route-matching middleware at the very end
app.use("/", require("./routes/index"));

app.listen(port, function (err) {
  if (err) {
    console.log(`error in running the server : ${err}`);
  } else {
    console.log(`server is up and running on port : ${port}`);
  }
});
