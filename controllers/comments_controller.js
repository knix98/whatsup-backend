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

module.exports.deleteComment = async function (req, res) {
  try {
    let comment = await Comment.findById(req.query.comment_id);

    //comment deletion should be allowed only to user who posted the comment
    //while comparing 2 ids like in below's if condition, its IMP that atleast 1 of the 2 is in .id form
    //make sure that both the values in the comparison shouldn't be in ._id form
    if (comment.user == req.user.id) {
      //first save the post-id on which the comment was made, so that we can delete the comment from that post's comments array also
      let postId = comment.post;

      comment.remove();

      //now remove the comment id from comments array of the parent post
      let post = await Post.findById(postId);
      post.comments.pull(req.query.comment_id);
      post.save();

      return res.status(200).json({
        success: true,
        message: "Comment deleted",
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
