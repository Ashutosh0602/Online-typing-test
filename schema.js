const mongoose = require("mongoose");

const userData = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  speed: {
    type: Number,
    required: true,
  },
});

const typeUser = mongoose.model("typeUser", userData);

module.exports = typeUser;
