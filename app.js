const express = require('express');
const app = express();  // create express app
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');  
const ejsMate = require('ejs-mate');
const Joi = require('joi')
const {campgroundSchema,reviewSchema} = require('./schemas.js');
const Review = require('./models/review'); 
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
  

// Test mongodb connection // update
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO MONGO CONNECTION ERROR!!!!");
    console.log(err);
  });

// set view engine to ejs    
app.set('view engine', 'ejs'); 

//This line sets the directory where your application will look for views
app.set('views', path.join(__dirname, 'views')); 

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// for PUT request
app.use(methodOverride('_method'));  

// For serving static files
app.engine('ejs',ejsMate); 

///////////////// Function var to validate the data
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

const validateReview = (req,res,next) => {
  const {error} = reviewSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}


/////////////////////////////////// ROUTING ////////////////////////////////////////////////////////


app.get('/',(req,res)=>{
    res.render('home');

})

// // Test mongodb connection
// app.get('/makecampground', async (req,res)=>{
//     const camp = new Campground({title:'My Backyard', description:'cheap camping!'});
//     await camp.save();
//     res.send(camp);
// })


app.get('/campgrounds', catchAsync(async (req,res)=>{
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', {campgrounds}); // pass in campgrounds
}))

// Make sure this route /new come before /:id
app.get('/campgrounds/new',(req,res)=>{
  res.render('campgrounds/new');
})

app.get('/campgrounds/:id',catchAsync(async (req,res)=>{
  const campground = await Campground.findById(req.params.id).populate('reviews');
  //console.log(campground);
  res.render('campgrounds/show', {campground});
}))


app.get('/campgrounds/:id/edit',catchAsync(async (req,res)=>{
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', {campground});
}))

// Key1: using catchAsync to wrap the async function
// Key2: using joi to validate the data
app.post('/campgrounds',validateCampground,catchAsync(async (req,res, next)=>{

  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
}))

app.post('/campgrounds/:id/reviews',validateReview,catchAsync(async (req,res)=>{
  // find the campground id 
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  await review.save(); // save the review
  await campground.save();
  // redirect to the show page
  res.redirect(`/campgrounds/${campground._id}`);
}))

app.put('/campgrounds/:id',validateCampground,catchAsync(async (req,res)=>{
  const {id} = req.params;
  /// Using ... spread operator for objects
  const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
  res.redirect(`/campgrounds/${campground._id}`); 
}))

// Delete the campground
app.delete('/campgrounds/:id',catchAsync(async (req,res)=>{
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect(`/campgrounds`); 
}))


// Delete the review
app.delete('/campgrounds/:id/reviews/:reviewId',catchAsync(async (req,res)=>{
  // Key delete the object ID
  const {id,reviewId} = req.params;
  await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/campgrounds/${id}`); 
}))







///////////////// Errror Handling /////////////////

// Very important step: this should be the last route
app.all('*',(req,res,next)=>{
  next(new ExpressError('Page Not Found', 404));
})


app.use((err,req,res,next)=>{
  const {statusCode = 500} = err;
  if(!err.message) err.message = 'Oh No, Something Went Wrong!';
  res.status(statusCode).render('error', {err});
  
})


// Start express server on port 3000
app.listen(3000, () => {
    console.log('server started on port 3000');
})