//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// level 2
// const encrypt = require("mongoose-encryption");
// level 3
// const md5 = require("md5");
// level 4
// const bcrypt = require("bcrypt");
// const saltRounds = 10;
// level 5
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

// level 5
app.use(session({
    secret: "calisthenicsissogoodforgettinwings",
    resave: false,
    saveUninitialized: false
}));

// level 5
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// level 5
userSchema.plugin(passportLocalMongoose);

// level 2
// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.get("/secrets", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("secrets");
    }
    else {
        res.redirect("/login");
    }
});

app.get("/logout", function(req, res) {
    req.logout(function(err) {
        if (!err) {
            res.redirect("/");
        }
        else {
            console.log(err);
        }
    });
    
});

app.post("/register", function(req, res) {
    User.register({username: req.body.username}, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        }
        else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/secrets");
            });
        }
    });
});

app.post("/login", function(req, res) {

    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/secrets");
            });
        }
    });

});


/* 

LEVEL 2-4 CODE HERE

app.post("/register", function(req, res) {

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User ({
            email: req.body.username,
            // level 4
            password: hash
            // level 3
            // password: md5(req.body.password)
        });
    
        newUser.save(function(err) {
            if (err) {
                console.log(err);
            }
            else {
                res.render("secrets");
            }
        });
    });
});

app.post("/login", function(req, res) {
    const username = req.body.username;
    // level 3
    // const password = md5(req.body.password);
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser) {
        if (err) {
            console.log(err);
        }
        else {
            if (foundUser) {
                // level 4
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if (result === true) {
                        res.render("secrets");
                    }
                });

                // level 3
                // if (foundUser.password === password) {
                //     res.render("secrets");
                // }
            }
        }
    });
});

*/


app.listen(3000, function() {
    console.log("Server started on port 3000");
});