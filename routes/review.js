const express = require('express');
const route = express.Router({mergeParams:true});
const { reviewSchema } = require('../schema.js');
const wrapAsync = require('../utils/wrapAsync.js');
const expressError = require('../utils/expressError.js');
const review = require('../models/review.js');
const listing = require('../models/listing.js')

const validateReview = ( req, res, next ) => {
    let { error } = reviewSchema.validate(req.body);

    if ( error ) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400,errMsg)
    }else{
        next();
    }
}

//add review
route.post("/", validateReview,wrapAsync( async( req, res ) => {
    let listings = await listing.findById(req.params.id);
    let newReview = new review(req.body.review);

    listings.reviews.push(newReview);
    await newReview.save();
    await listings.save();
    req.flash('success','new review created');

    res.redirect(`/listings/${listings._id}`)
}))

//delete review route
route.delete("/:reviewId", wrapAsync( async ( req, res ) => {
    let { id, reviewId } = req.params;

    await listing.findByIdAndUpdate( id, { $pull : { reviews: reviewId }});
    await review.findByIdAndDelete(reviewId);
    req.flash('success','review deleted!');

    res.redirect(`/listings/${id}`);
}))

module.exports = route;