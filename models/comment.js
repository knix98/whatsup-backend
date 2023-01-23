const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      //comment made by which user
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    post: {
      //comment made on which post
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Post",
    },
    //include the array of ids of all likes on this comment
    likes: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Like",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
