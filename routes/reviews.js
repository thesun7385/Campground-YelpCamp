const express = require('express');
// Merge the params from the campgrounds and reviews
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync'); // key: path from current directory to the catchAsync file
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground'); 
const Review = require('../models/review'); 
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware');

router.post('/',isLoggedIn,validateReview,catchAsync(async (req,res)=>{
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
    res.redirect(`/campgrounds/${campground._id}`);
    }))
  
// Delete the review
// Concept: check current user, and check the ownership
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(async (req,res)=>{
  // Key delete the object ID
  const {id,reviewId} = req.params;
  await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfully deleted review!');
  res.redirect(`/campgrounds/${id}`); 
  }))
  
module.exports = router;