const mongoose = require("mongoose");

const Register = new mongoose.Schema({
     username: String,
     password: String,
     isLogged: Boolean,
     user_id: String
});

const RegisterModel = mongoose.model("users", Register);

module.exports = RegisterModel;