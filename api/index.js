import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

//Database connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }).then(
  () => {
    console.log("Connected to db");
  },
  (err) => {
    console.log("Something went wrong" + err);
  }
);

const app = express();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
