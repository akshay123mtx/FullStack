//************************************//
	// Packages and Server Setup //
	// NOTE- SUPERADMIN CAN CREATE MORE SUBADMINS //
	// USERNAME AND PASSWORD FOR SUPERADMIN IN .env //
//************************************//
const express = require("express");
const app = express();
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const methodOverride = require("method-override");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const expressSanitizer = require("express-sanitizer");
const routes = require('./routes/routes.js');
const User = require("./models/user");
const Blog = require("./models/blog");
const dotenv = require('dotenv');
dotenv.config();

app.use(expressSanitizer());
app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

mongoose.connect(process.env.URL);

app.use(require("express-session")({
	secret: "Rusty is a dog",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', routes); // calling routes in routes.js

app.listen(process.env.PORT || 8080);
console.log("server is running");
