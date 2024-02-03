const express = require('express');
// Merge the params from the campgrounds and reviews
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync'); // key: path from current directory to the catchAsync file
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground'); 
const Review = require('../models/review'); 
const {reviewSchema} = require('../schemas.js');

// Function to catch async errors for review
const validateReview = (req,res,next) => {
  const {error} = reviewSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}


router.post('/',validateReview,catchAsync(async (req,res)=>{
    // find the campground id 
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save(); // save the review
    await campground.save();
    req.flash('success', 'Created new review!');
    // redirect to the show page
    res.redirect(`/campgrounds/${campground._id}`);
    }))
  
// Delete the review
router.delete('/:reviewId',catchAsync(async (req,res)=>{
  // Key delete the object ID
  const {id,reviewId} = req.params;
  await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfully deleted review!');
  res.redirect(`/campgrounds/${id}`); 
  }))
  
module.exports = router;