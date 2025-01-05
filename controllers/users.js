const User = require('../models/user.js');

module.exports.renderSignupForm = (req, res) => {
    res.render("user/signup.ejs")
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to wanderlust");
            res.redirect("/listings");
        })
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("user/login.ejs")
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust");
    res.redirect(res.locals.redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "you are logged out");
        res.redirect("/listings");
    })
};