const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    user: {
      //the user who liked a comment/post
      type: mongoose.Schema.ObjectId,
    },
    // this defines the object id of the liked object
    likeable: {
      type: mongoose.Schema.ObjectId,
      require: true,
      refPath: "onModel", //By using refPath: "onModel", Mongoose will look at the onModel property to find the right model dynamically.
    },
    // this field is used for defining the type of the liked object since this is a dynamic reference
    onModel: {
      type: String,
      required: true,
      //enum specifies that onModel value can be 1 from among the below values only
      //if we do not specify enum here, then onModel can take any value and wouldn't be restricted to just the below 2 values
      enum: ["Post", "Comment"],
    },
  },
  {
    timestamps: true,
  }
);

const Like = mongoose.model("Like", likeSchema);
module.exports = Like;
