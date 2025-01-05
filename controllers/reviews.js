const listing = require('../models/listing');
const review = require('../models/review');

module.exports.createReview = async (req, res) => {
    let listings = await listing.findById(req.params.id);
    let newReview = new review(req.body.review);

    listings.reviews.push(newReview);
    newReview.author = req.user._id;

    await newReview.save();
    await listings.save();
    req.flash('success','new review created');

    res.redirect(`/listings/${listings._id}`)
}

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);
    req.flash('success', 'review deleted!');

    res.redirect(`/listings/${id}`);
};