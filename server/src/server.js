require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const authRouter = require('./routes/auth.router')

const app = express();

app.use(cors());
app.use(express.json());


app.use('/',authRouter)


connectDB()
  .then(() => {
    console.log("Database Connected!");
    app.listen(5555, () => {
      console.log("Server is Running on 5555");
    });
  })
  .catch((err) => {
    console.log(err);
  });
