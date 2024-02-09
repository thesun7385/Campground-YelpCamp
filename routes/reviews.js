const express = require('express');
// Merge the params from the campgrounds and reviews
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync'); // key: path from current directory to the catchAsync file
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground'); 
const Review = require('../models/review'); 
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware');
const reviews = require('../controllers/reviews');
const review = require('../models/review');

// Create a review
// Concept: check current user, and check the ownership
router.post('/',isLoggedIn,validateReview,catchAsync(reviews.createReview))
// Delete the review
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview))
  

//export the router
module.exports = router;