const express = require('express');
const route = express.Router({mergeParams:true});
const { validateReview, isloggedin, isReviewAuthor } = require('../middleware.js');
const wrapAsync = require('../utils/wrapAsync.js');
const reviewController = require('../controllers/reviews.js');

//add review
route.post("/", isloggedin, validateReview,wrapAsync(reviewController.createReview));

//delete review route
route.delete("/:reviewId", isloggedin, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = route;