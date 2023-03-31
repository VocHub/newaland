const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const chalk = require("chalk");
const cors = require("cors");
chalk.enabled = true
chalk.level = 3

function fixColors (str) {
  return str.replace(/\%1B/i, '\\u%1B')
};
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: path.join(__dirname, '.env' )});
}

console.log('\n \n \n \n');
app.use(cors());
app.use(
  "/api",
  require(path.resolve(__dirname, "server", "routes.js")), next =>{
    res.header("Access-Control-Allow-Origin", "https://news-from.herokuapp.com/");
    res.header("Access-Control-Allow-Headers");
    res.set("Content-Type", "application/json");
  }
);

// Serve static assets 	if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "build")));
  app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
}
const db = `mongodb+srv://juliusdorfman:${process.env.MONGO_DB_PASSWORD}@news-from-cluster.mrd9j5e.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", true);
// Connect to MongoDB
const connection = mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connection
  .then((db) => {
    console.log(fixColors(chalk.green.underline(`Connected to MongoDB`)));
  })
  .catch((err) => console.log(fixColors(chalk.red(`Error connecting to MongoDB: ${err}`))));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(fixColors(chalk.blueBright.underline(`Server running on port: ${port}`)));
});
