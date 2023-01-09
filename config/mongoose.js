const mongoose = require("mongoose");

const env = require("./environment");

//we establish connection between mongoose and our database and await for that connection to happen
async function main() {
  await mongoose.connect(`mongodb://localhost:27017/${env.db}`);
}

//when connection established, we print success message
main()
  .then((value) => {
    console.log("successfully connected to database : MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
