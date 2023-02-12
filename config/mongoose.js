const mongoose = require("mongoose");

//we establish connection between mongoose and our database and await for that connection to happen
async function main() {
  await mongoose.connect(process.env.DB);
}

//when connection established, we print success message
main();
