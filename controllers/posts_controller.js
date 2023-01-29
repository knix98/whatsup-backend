const Post = require("../models/post");

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
      data: posts,
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
