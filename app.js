//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express
const encrypt = require("mongoose-encryption");

const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.listen(port, () => console.log(`Server started at port: ${port}`)
);

mongoose.connect("mongodb://localhost:27017/userDB")
// connect to MongoDB, specify url where mongoDB database is located which is always localhost, then
// specify name of DB

// js object
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
const secret = "Thisisthesecretstringforencryption.";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });
const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){

  let {name} = req.body.username;
  let avatarApi = "https://api.dicebear.com/5.x/micah/svg?seed=${name}";
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if(err){
      console.og(err);
    } else{
      res.render("secrets");
    }
  });
});
