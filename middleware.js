const listing = require('./models/listing');
const review = require('./models/review');
const expressError = require('./utils/expressError');
const { listingSchema, reviewSchema } = require('./schema.js');

module.exports.isloggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to add listing")
        return res.redirect("/login")
    }
    next();
}

module.exports.saveUrl = (req, res, next) => { 
    res.locals.redirectUrl = req.session.redirectUrl || '/listings';
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let data = await listing.findById(id);
    if ( data && !data.owner._id.equals(res.locals.currUser._id)) {
        req.flash('error', 'you are not the owner of this listing');
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = ( req, res, next ) => {
    let { error } = listingSchema.validate(req.body);

    if ( error ) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400,errMsg)
    }else{
        next();
    }
}

module.exports.validateReview = ( req, res, next ) => {
    let { error } = reviewSchema.validate(req.body);

    if ( error ) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400,errMsg)
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id , reviewId } = req.params;
    let data = await review.findById(reviewId);
    if ( data && !data.author._id.equals(res.locals.currUser._id)) {
        req.flash('error', 'you are not the author of this review');
        return res.redirect(`/listings/${id}`);
    }
    next();
}