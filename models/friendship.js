const mongoose = require("mongoose");
// we are making this schema so that, all the friendships(along with their friend req sender and reciever)
//could be stored in 1 place, and the refs of this could be stored in the friendships field of users
//this will make our queries a lot faster

const friendshipSchema = new mongoose.Schema(
  {
    //the user who sent this request
    from_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    //the user who accepted this request
    to_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Friendship = mongoose.model("Friendship", friendshipSchema);
module.exports = Friendship;
