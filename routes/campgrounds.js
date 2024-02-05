const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const {isLoggedIn, isAuthor,validateCampground} = require('../middleware');


/////////////////////////// Campground Routes ////////////////////////////////

router.get('/', catchAsync(async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds}); // pass in campgrounds
  }))
  
// Make sure this route /new come before /:id
router.get('/new',isLoggedIn,(req,res)=>{
  res.render('campgrounds/new');
})

router.get('/:id',catchAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id).
    populate({
      path:'reviews',
      populate:{
        path:'author'     
      }})
    .populate('author');
    console.log(campground);
    if(!campground){
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds'); 
    }
    res.render('campgrounds/show', {campground});
}))

  
router.get('/:id/edit', isLoggedIn, isAuthor,catchAsync(async (req,res)=>{
  const {id} = req.params;
  const campground = await Campground.findById(id);
  if(!campground){
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds'); 
  }

  res.render('campgrounds/edit', {campground});
}))

// Key1: using catchAsync to wrap the async function
// Key2: using joi to validate the data
router.post('/',isLoggedIn,validateCampground,catchAsync(async (req,res, next)=>{
  const campground = new Campground(req.body.campground);
  // Save the author of the campground
  campground.author = req.user._id;
  await campground.save();
  req.flash('success', 'Successfully made a new campground!');
  res.redirect(`/campgrounds/${campground._id}`);
}))


router.put('/:id',isLoggedIn, isAuthor,validateCampground,catchAsync(async (req,res)=>{
  const {id} = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
  req.flash('success', 'Successfully updated campground!');
  res.redirect(`/campgrounds/${campground._id}`); 
}))

// Delete the campground
router.delete('/:id',isLoggedIn,isAuthor,catchAsync(async (req,res)=>{
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted campground!');
  res.redirect(`/campgrounds`); 
}))



module.exports = router;