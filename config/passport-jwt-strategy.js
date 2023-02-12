const passport = require("passport");
//require and store the Strategy and ExtractJwt functions from passport-jwt module (all mentioned in passport-jwt documentation, we just copied)
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const User = require("../models/user");

//doing as mentioned in documentation
//opts is an object literal containing options to control how the token is extracted from the request or verified.
let opts = {
  //mention the function to be used to extract jwt from req
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.jwt_secret, //this key provided by us will be used for encryption and decryption of jwt
};

// configuring jwt strategy inside passport, so that passport uses this config done by us for jwt authentication wherever told to
//jwtPayload is the extracted payload from the jwt which basically contains all the info about the user
//done is the callback function
passport.use(
  new JWTstrategy(opts, function (jwtPayload, done) {
    User.findById(jwtPayload._id, function (err, user) {
      if (err) {
        return done(err);
      }

      if (user) {
        return done(null, user);
      } else {
        //no error in the finding operation, but the given user._id not present in the DB
        return done(null, false);
      }
    });
  })
);

module.exports = passport;
