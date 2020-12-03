const express = require('express');
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const Blog = require("../models/blog");
const userController = require("../controller/userController.js");

// SIGNUP ROUTE
router.get("/register", userController.registerForm);

// CREATE SELLER ACCOUNT
router.post("/register", userController.register);

//ACCOUNT CREATION OF SUBADMIN BY SUPERADMIN
router.post("/adminregister", userController.adminregister);

// LOGIN INTO THE SYSTEM
router.get("/login", userController.loginForm);

// GET LOGIN FORM
router.post("/login", userController.login);

//LOGOUT ROUTE
router.get("/logout", userController.logout);

// GET ALL THE PRODUCTS FOR PUBLIC VIEW(ALL) OR 
//SELLER(CREATED BY SELLER ONLY) OR ADMIN(ALL PRODUCTS WITH DELETE ACCESS)
router.get("/blogs", userController.getBlogs);

// SELLER->  NEW PRODUCT FORM
router.get("/blogs/new", userController.isLoggedIn, userController.newBlog);

// SELLER-> ADD NEW PRODUCT
router.post("/blogs", userController.createBlog);

// ADMIN-> DELETE PRODUCT
router.delete("/blogs/:id", userController.deleteBlog);

module.exports = router;