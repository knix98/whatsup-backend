const Post = require("../models/post");

module.exports.posts = async function (req, res) {
  try {
    let posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(req.query.limit)
      .populate("user", "name")
      .populate({
        path: "comments",
        populate: {
          path: "user",
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
