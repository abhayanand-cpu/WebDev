const express = require('express')
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveUrl } = require('../middleware.js');
const userController = require('../controllers/users.js');
const user = require('../models/user.js');

router.route("/signup")
    .get(userController.renderSignupForm) //signup form
    .post(wrapAsync(userController.signup)); //signup route

router.route("/login")
    .get(userController.renderLoginForm) //login form
    .post(saveUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.login); //login route

router.get("/logout", userController.logout);

module.exports = router;