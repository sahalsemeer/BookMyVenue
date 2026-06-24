const mongoose = require("mongoose");
const { isLowercase } = require("validator");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowecase:true,
    trim:true,
    unique:true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["customer","owner"],
  },
},{timestamps:true});

const userModel = mongoose.model("user", UserSchema);

module.exports = userModel;
