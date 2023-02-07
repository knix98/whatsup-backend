const User = require("../models/user");

module.exports.addFriend = async function (req, res) {
  try {
    let userFriend = await User.findById(req.user._id);
    let otherFriend = await User.findById(req.query.user_id);

    if (!userFriend || !otherFriend) {
      return res.status(400).json({
        success: false,
        message: "Bad request",
      });
    }

    userFriend.friends.push(req.query.user_id);
    userFriend.save();
    otherFriend.friends.push(req.user._id);
    otherFriend.save();

    return res.status(200).json({
      success: true,
      message: "Friendship created successfully",
      data: {
        friend: {
          _id: otherFriend._id,
          name: otherFriend.name,
          email: otherFriend.email,
          image: otherFriend.image,
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

module.exports.removeFriend = async function (req, res) {
  try {
    let userFriend = await User.findById(req.user._id);
    let otherFriend = await User.findById(req.query.user_id);

    if (!userFriend || !otherFriend) {
      return res.status(400).json({
        success: false,
        message: "Bad request",
      });
    }

    userFriend.friends.pull(req.query.user_id);
    userFriend.save();
    otherFriend.friends.pull(req.user._id);
    otherFriend.save();

    return res.status(200).json({
      success: true,
      message: "Friendship removed successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
