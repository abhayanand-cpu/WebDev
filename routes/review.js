const express = require('express');
const route = express.Router({mergeParams:true});
const { validateReview, isloggedin, isReviewAuthor } = require('../middleware.js');
const wrapAsync = require('../utils/wrapAsync.js');
const review = require('../models/review.js');
const listing = require('../models/listing.js')

//add review
route.post("/", isloggedin, validateReview,wrapAsync( async( req, res ) => {
    let listings = await listing.findById(req.params.id);
    let newReview = new review(req.body.review);

    listings.reviews.push(newReview);
    newReview.author = req.user._id;

    await newReview.save();
    await listings.save();
    req.flash('success','new review created');

    res.redirect(`/listings/${listings._id}`)
}))

//delete review route
route.delete("/:reviewId", isloggedin, isReviewAuthor, wrapAsync( async ( req, res ) => {
    let { id, reviewId } = req.params;

    await listing.findByIdAndUpdate( id, { $pull : { reviews: reviewId }});
    await review.findByIdAndDelete(reviewId);
    req.flash('success','review deleted!');

    res.redirect(`/listings/${id}`);
}))

module.exports = route;