const passport = require("passport");
const User = require("../models/user");
const Blog = require("../models/blog");




// CHECK USER IS LOGGED IN OR NOT
exports.isLoggedIn = async (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.flash("error", "Please Login First!!");
    res.redirect("/login");
}

//ACCOUNT CREATION OF SUBADMIN BY SUPERADMIN
exports.adminregister = async (req, res) => {
    var username = req.body.username
    var password = req.body.password

    User.register(new User({ role: "admin", username: username }),
        password, (err, user) => {
            if (err) {
                return res.redirect("/blogs");
            }

            passport.authenticate("local")(
                req, res, function () {
                    res.redirect("/blogs");
                });
        });
}


// SIGNUP ROUTE
exports.registerForm = async (req, res) => {
    res.render("register");
}


// CREATE SELLER ACCOUNT
exports.register = async (req, res) => {
    const username = req.body.username
    const role = req.body.role
    const password = req.body.password

    User.register(new User({ role: role || "seller", username: username }),
        password, function (err, user) {
            if (err) {
                req.flash("error", "User already exists!!");
                return res.render("register");
            }
            passport.authenticate("local")(req, res, () => {
                req.flash("success", "Registered Successfully!!");
                res.redirect("/blogs");
            });
        });
}

// GET LOGIN FORM
exports.loginForm = async (req, res) => {
    res.render("login");
}


// LOGIN INTO THE SYSTEM
exports.login = async (req, res, next) => {
    passport.authenticate('local',
        (err, user, info) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                req.flash("error", "SignUp First!!");
                res.redirect("/register");
            }

            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }

                return res.redirect('/blogs');
            });

        })(req, res, next);
}


//LOGOUT ROUTE
exports.logout = async (req, res) => {
    req.logout();
    req.flash("success", "Logged You Out!!");
    res.redirect("/login");
}



//SEARCH PRODUCT TITLE WISE
escapeRegex = (text) => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

// SEARCH QUERY FUNCTIONs
withSearchQuery = (req, res) => {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Blog.find({ "title": regex }, (err, data) => {
        if (err)
            console.log(err);
        else {
            res.render("index", { blogs: data });
        }
    });
}

withoutSearchQuery = (req, res) => {
    Blog.find({}, (err, data) => {
        if (err)
            console.log(err);
        else {
            res.render("index", { blogs: data });
        }
    });
}

// GET ALL THE PRODUCTS FOR PUBLIC VIEW(ALL) OR
//SELLER(CREATED BY SELLER ONLY) OR ADMIN(ALL PRODUCTS WITH DELETE ACCESS)
exports.getBlogs = async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.role === "admin") {
            if (req.query.search) {
                withSearchQuery(req, res);
            }
            else {
                withoutSearchQuery(req, res);
            }

        }
        else if (req.user.role === "seller") {
            console.log("->>>>" + req.user._id);
            if (req.query.search) {
                const regex = new RegExp(escapeRegex(req.query.search), 'gi');
                Blog.find({ "title": regex, author: { id: req.user._id, username: req.user.username } }, (err, data) => {
                    if (err)
                        console.log(err);
                    else {
                        res.render("index", { blogs: data });
                    }

                });
            }
            else {
                Blog.find({ author: { id: req.user._id, username: req.user.username } }, (err, data) => {
                    if (err)
                        console.log(err);
                    else {
                        res.render("index", { blogs: data });
                    }

                });
            }
        }
    }
    else {
        if (req.query.search) {
            withSearchQuery(req, res);
        }
        else {
            withoutSearchQuery(req, res);
        }
    }

}

// SELLER->  NEW PRODUCT FORM
exports.newBlog = async (req, res) => {
    if (req.user.role === 'seller')
        res.render("new");
    else res.send("permission denied");
}



// SELLER-> ADD NEW PRODUCT
exports.createBlog = async (req, res) => {
    const title = req.body.title;
    const img = req.body.image;
    const body = req.body.body;
    const cost = req.body.cost;
    var author = {
        id: req.user._id,
        username: req.user.username
    }

    var newBlog = { title: title, image: img, body: body, cost: cost, author: author };
    Blog.create(newBlog, (err, x) => {
        if (err)
            console.log(err);
        else {
            res.redirect("/blogs");
        }
    })
}

// ADMIN-> DELETE PRODUCT
exports.deleteBlog = async (req, res) => {
    Blog.findByIdAndRemove(req.params.id, (err) => {
        if (err)
            console.log(err);
        else
            res.redirect("/blogs");
    });
}





