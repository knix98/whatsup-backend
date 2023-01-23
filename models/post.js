const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content: {
      //content of each post
      type: String,
      required: true,
    },
    user: {
      //will store ObjectId(from MongoDB) of the user who posts the post
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //the ObjectId above is to be taken from User schema
    },
    //include the array of ids of all comments of this post
    //this would make the fetching of all the comments on each post fast(faster than searching comments of a post from the Comment schema), because it needs to be done a lot frequently
    comments: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Comment",
      },
    ],
    //include the array of ids of all likes on this post
    likes: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Like",
      },
    ],
  },
  {
    timestamps: true, //for getting the created at, updated at fields
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
