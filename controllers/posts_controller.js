const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.posts = async function (req, res) {
  try {
    let posts = await Post.find()
      .sort({ createdAt: -1 }) //sorting by: latest first
      .limit(req.query.limit) //limiting the number of posts to the limit
      .populate("user", "name") //populating only the name field of user field
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

module.exports.createPost = async function (req, res) {
  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });

    post = await post.populate("user", "name email");

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
