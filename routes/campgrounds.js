const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {campgroundSchema,reviewSchema} = require('../schemas.js');

///////////////// Function var to validate campground /////////////////
const validateCampground = (req,res,next)=>{

  
    // Using destructuring to access the error property object
    const {error} = campgroundSchema.validate(req.body);

    if(error){
      // Throw error and pass to next middleware
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400);
    }else{
      next();     
    }

}

////////// Campground Routes ////////////////////////////////

router.get('/', catchAsync(async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds}); // pass in campgrounds
  }))
  
// Make sure this route /new come before /:id
router.get('/new',(req,res)=>{
    res.render('campgrounds/new');
})

router.get('/:id',catchAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if(!campground){
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds'); 
    }
    res.render('campgrounds/show', {campground});
}))

  
router.get('/:id/edit',catchAsync(async (req,res)=>{
  const campground = await Campground.findById(req.params.id);
  if(!campground){
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds'); 
  }
  res.render('campgrounds/edit', {campground});
}))

// Key1: using catchAsync to wrap the async function
// Key2: using joi to validate the data
router.post('/',validateCampground,catchAsync(async (req,res, next)=>{
  const campground = new Campground(req.body.campground);
  await campground.save();
  req.flash('success', 'Successfully made a new campground!');
  res.redirect(`/campgrounds/${campground._id}`);
}))


router.put('/:id',validateCampground,catchAsync(async (req,res)=>{
const {id} = req.params;
/// Using ... spread operator for objects
const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
req.flash('success', 'Successfully updated campground!');
res.redirect(`/campgrounds/${campground._id}`); 
}))

// Delete the campground
router.delete('/:id',catchAsync(async (req,res)=>{
const {id} = req.params;
await Campground.findByIdAndDelete(id);
req.flash('success', 'Successfully deleted campground!');
res.redirect(`/campgrounds`); 
}))



module.exports = router;