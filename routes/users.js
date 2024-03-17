// var express = require("express");
// var router = express.Router();
const mongoose = require("mongoose");
const HandleMongodb = (url) => {
  return mongoose.connect(url);
};

module.exports = { HandleMongodb };
