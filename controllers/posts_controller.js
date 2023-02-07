const multer = require("multer");
const fs = require("fs");
const path = require("path");

const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.posts = async function (req, res) {
  try {
    let posts = await Post.find()
      .sort({ createdAt: -1 }) //sorting by: latest first
      // .limit(req.query.limit) //limiting the number of posts to the limit
      .populate("user", "name email image") //populating only the name, email and image field of user field
      .populate({
        path: "comments", //populating comments
        populate: {
          path: "user", //populating only name of user field inside comments
          select: "name",
        },
      });

    return res.status(200).json({
      message: "List of posts",
      success: true,
      data: {
        posts: posts,
      },
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
    cb(null, "uploads/posts/content_images");
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

module.exports.uploadImage = upload.single("post_img");

module.exports.createPost = async function (req, res) {
  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });

    if (req.file) {
      //saving the path of the uploaded file into the image field in the post
      post.image = "/uploads/posts/content_images/" + req.file.filename;
      post.save();
    }

    post = await post.populate("user", "name email image");

    return res.status(200).json({
      data: {
        post: post,
      },
      success: true,
      message: "Post Created !",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports.deletePost = async function (req, res) {
  try {
    let post = await Post.findById(req.query.post_id);

    //only the user who posted the post should be allowed to delete the post
    if (post.user == req.user.id) {
      if (post.image) {
        //if some file link is present for image field
        //then first check whether the present link is empty or actually has a image present at it
        //because if we do fs.unlinkSync on an empty path_location, then error occurs
        if (fs.existsSync(path.join(__dirname, "..", post.image))) {
          //if some image is actually present already then only delete that from disk storage
          fs.unlinkSync(path.join(__dirname, "..", post.image));
        }
      }

      post.remove();

      //also delete all the comments on this post
      await Comment.deleteMany({ post: req.query.post_id }); //deleteMany doesn't return any promise, only deletes according to the passed query

      return res.status(200).json({
        success: true,
        message: "Post deleted",
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
