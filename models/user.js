const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    friendships: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Friendship",
      },
    ],
  },
  {
    timestamps: true, //to store the created and the updated dates of the user profile
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
