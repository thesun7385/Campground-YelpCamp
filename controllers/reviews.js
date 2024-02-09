const Campground = require('../models/campground'); 
const Review = require('../models/review'); 

module.exports.createReview = async (req,res)=>{
    // find the campground id 
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
     // set the author of the review
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save(); // save the review
    await campground.save();
    req.flash('success', 'Created new review!');
    // redirect to the show page
    res.redirect(`/campgrounds/${campground._id}`); }

module.exports.deleteReview = async (req,res)=>{
    // Key delete the object ID
    const {id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/campgrounds/${id}`); 
    }