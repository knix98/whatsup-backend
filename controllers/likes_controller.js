const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.toggleLike = async function (req, res) {
  try {
    // likes/toggle?likeable_id=${itemId}&likeable_type=${itemType}
    let likeable;
    let deleted = false; //if we delete a like then we wud make this to true

    //determining what the likeable was on which the like was made
    if (req.query.likeable_type == "Post") {
      likeable = await Post.findById(req.query.likeable_id);
    } else {
      likeable = await Comment.findById(req.query.likeable_id);
    }

    let likeExists = likeable.likes.indexOf(req.user._id);

    if (likeExists != -1) {
      //means like is already present by logged-in user
      likeable.likes.pull(req.user._id);
      likeable.save();

      deleted = true;
    } else {
      likeable.likes.push(req.user._id);
      likeable.save();
    }

    return res.status(200).json({
      message: "Request successful",
      success: true,
      data: {
        deleted: deleted,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
