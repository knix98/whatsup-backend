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
    image: {
      //this field will store the address where the profile_pic file has been kept
      //the storage could be local (server disk storage) or some cloud storage elsewhere (like AWS)
      //in our case it's the local address since all pics are stored in: '/uploads/users/profile_pics' (i.e on server (my PC) storage only)
      type: String,
    },
    friends: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true, //to store the created and the updated dates of the user profile
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
