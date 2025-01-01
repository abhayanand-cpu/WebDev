module.exports.isloggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "you must be logged in to add listing")
        return res.redirect("/login")
    }
    next();
}