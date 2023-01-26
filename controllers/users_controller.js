const User = require("../models/user");
//this npm library is required for creating JWTs
const jwt = require("jsonwebtoken");
const env = require("../config/environment");

module.exports.signUp = async function (req, res) {
  try {
    //first check whether password and confirm_password match
    if (req.body.password != req.body.confirm_password) {
      return res.status(400).json({
        success: false,
        message: "Entered password didn't match with confirmed password",
      });
    }

    let user = await User.findOne({ email: req.body.email });

    //if user not found then create a new user
    if (!user) {
      user = await User.create(req.body);

      return res.status(201).json({
        success: true,
        message: "New user registered successfully",
      });
    } else {
      //if user present already and found
      return res.status(400).json({
        success: false,
        message: "Entered email id is already used by some other user",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports.logIn = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user || user.password != req.body.password) {
      return res.status(422).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Sign in successful",
      //in the data we will generate and send the JWT
      data: {
        //1st argument is converting the found user to JSON object
        //2nd argument is the same key as we mentioned in passport-jwt confif file
        //3rd is the time after which JWT expires in milliseconds
        token: jwt.sign(user.toJSON(), env.jwt_secret, {
          expiresIn: "100000",
        }),
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
