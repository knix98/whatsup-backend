const express = require("express");
const app = express();
const port = 7000;

const env = require("./config/environment");
require("./config/mongoose"); //code for setting up connection(using mongoose) to our db(MongoDb) running in the background

//keeping the route-matching middleware at the very end
app.use("/", require("./routes/index"));

app.listen(port, function (err) {
  if (err) {
    console.log(`error in running the server : ${err}`);
  } else {
    console.log(`server is up and running on port : ${port}`);
  }
});
