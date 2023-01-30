const Comment = require("../models/comment");
const Post = require("../models/post");

module.exports.createComment = async function (req, res) {
  try {
    let post = await Post.findById(req.body.post_id);

    if (!post) {
      //post not found with given post_id, that means some hacker altered the post id sent thru the req
      return res.status(400).json({
        success: false,
        message: "Bad request",
      });
    }

    let comment = await Comment.create({
      content: req.body.content,
      post: req.body.post_id,
      user: req.user._id,
    });

    post.comments.push(comment._id);
    post.save();

    comment = await comment.populate("user", "name email");

    return res.status(200).json({
      success: true,
      message: "Comment published successfully",
      data: {
        comment: comment,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
