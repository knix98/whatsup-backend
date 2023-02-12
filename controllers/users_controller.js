const multer = require("multer");
const fs = require("fs");
const path = require("path");

const User = require("../models/user");
//this npm library is required for creating JWTs
const jwt = require("jsonwebtoken");

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
    let user = await User.findOne({ email: req.body.email }).populate(
      "friends",
      "name email image"
    );

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
        token: jwt.sign(user.toJSON(), process.env.JWT_SECRET, {}),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          friends: user.friends,
          image: user.image,
        },
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports.edit = async function (req, res) {
  try {
    if (req.user._id == req.body.id) {
      let updatedUser = await User.findByIdAndUpdate(req.body.id, req.body, {
        new: true,
      }).populate("friends", "name email image");

      return res.status(200).json({
        success: true,
        message: "User info updated successfully",
        //in the data we will generate and send the JWT
        data: {
          token: jwt.sign(updatedUser.toJSON(), process.env.JWT_SECRET, {}),
          user: {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            friends: updatedUser.friends,
            image: updatedUser.image,
          },
        },
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Unauthorised",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports.profile = async function (req, res) {
  try {
    let profileUser = await User.findById(req.params.userId);

    if (!profileUser) {
      return res.status(400).json({
        success: false,
        message: "User Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: {
          email: profileUser.email,
          name: profileUser.name,
          image: profileUser.image,
          _id: profileUser._id,
        },
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports.search = async function (req, res) {
  try {
    let searchText = req.query.text.trim(); //trim wud remove any whitespaces before and after the text
    let users = await User.find({
      name: { $regex: new RegExp("^" + searchText + ".*", "i") },
    });

    if (users) {
      return res.status(200).json({
        success: true,
        data: {
          users: users,
        },
      });
    }

    return res.status(204).json({
      success: false,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/users/profile_pics");
  },
  filename: (req, file, cb) => {
    //using uniqueSuffix, so that same file-names can also be differentiated
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.mimetype.split("/")[1];
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + fileExtension);
  },
});

//this function is for filtering only image files to be uploaded
const isImage = (req, file, cb) => {
  //file = req.file, req.file contains a key 'mimetype'
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

const upload = multer({
  storage: multerConfig,
  fileFilter: isImage,
});

module.exports.uploadImage = upload.single("photo");

module.exports.uploadUserPic = async (req, res) => {
  try {
    let user = await User.findById(req.user.id).populate(
      "friends",
      "name email image"
    );

    //we are able to access the form body of a multipart form because of multer
    //Multer adds a body object and a file or files object to the request object. The body object contains the values of the text fields of the form,
    //the file or files object contains the files uploaded via the form.

    //if some file was uploaded thru the multipart form than only the 'file' object would be present inside req
    if (req.file) {
      if (user.image) {
        //if some file link is present for image field
        //then first check whether the present link is empty or actually has a image present at it
        //because if we do fs.unlinkSync on an empty path_location, then error occurs
        if (fs.existsSync(path.join(__dirname, "..", user.image))) {
          //if some image is actually present already then only delete that from disk storage
          fs.unlinkSync(path.join(__dirname, "..", user.image));
        }
      }

      //saving the path of the uploaded file into the avatar field in the user
      user.image = "/uploads/users/profile_pics/" + req.file.filename;
    }

    user.save();

    res.status(200).json({
      success: true,
      message: "Profile pic uploaded successfully",
      data: {
        token: jwt.sign(user.toJSON(), process.env.JWT_SECRET, {}),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          friends: user.friends,
          image: user.image,
        },
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `${err.message}`,
    });
  }
};
