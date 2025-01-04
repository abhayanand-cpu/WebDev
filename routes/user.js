const express = require('express')
const router = express.Router();
const User = require('../models/user.js')
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveUrl } = require('../middleware.js');

router.get("/signup",( req, res ) => {
    res.render("user/signup.ejs")
});

router.post("/signup",wrapAsync( async( req, res ) => {
    try{
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success","Welcome to wanderlust");
            res.redirect("/listings");
        })
    }catch( err ){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}));

router.get("/login",( req, res ) => {
    res.render("user/login.ejs")
});

router.post("/login", saveUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust");
    res.redirect(res.locals.redirectUrl);
});

router.get("/logout", (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "you are logged out");
        res.redirect("/listings");
    })
})
module.exports = router;