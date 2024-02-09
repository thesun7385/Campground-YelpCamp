const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session'); 
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const app = express();  // create express app
const Joi = require('joi')

// Allows to authenticate via different strategies
const passport = require('passport'); 
const LocalStrategy = require('passport-local');
const User = require('./models/user');

/// You have changed routes to campgrounds.js and reviews.js, so no need to require them here
// const Campground = require('./models/campground'); 
// const Review = require('./models/review'); 
// const {campgroundSchema,reviewSchema} = require('./schemas.js');
// const catchAsync = require('./utils/catchAsync');

// Set environment variable
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

console.log('Cloudinary Name: '+ process.env.COULDINARY_CLOUD_NAME);
console.log('Cloudinary Key: '+ process.env.COULDINARY_KEY);


///////////////// Import routes /////////////
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

// Test mongodb connection // update
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Not required  useFindAndModify: false as default is false
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO MONGO CONNECTION ERROR!!!!");
    console.log(err);
  });


// Session configuration
const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expire: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week in milliseconds
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig));

// Flash configuration
app.use(flash());
// Set-up middleware 

// set view engine to ejs    
app.set('view engine', 'ejs'); 

// This line sets the directory where your application will look for views
// Key: app.use(express.static('view')); doesn't handle dynamic routes or template rendering
// You must use typically need to specify a separate directory for those templates using app.set('views', path.join(__dirname, 'views'))
app.set('views', path.join(__dirname, 'views')); 

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// for PUT request
app.use(methodOverride('_method'));  

// For serving static files
app.engine('ejs',ejsMate); 

//This line sets the directory where your application will look for public
app.use(express.static(path.join(__dirname, 'public')));  

//////////////////////////// MIDDELWARE FOR AUTHENTICATION ///////////////
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // store in session
passport.deserializeUser(User.deserializeUser()); // unstore in session

// Middleware to check if user is logged in and to display the user in the header
app.use((req,res,next)=>{
  //console.log(req.session);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

/////////////////////////////////// ROUTING ////////////////////////////////////////////////////////
// Use the routes
// Evrything in the campgrounds file will start with /campgrounds 
// and everything in the reviews file will start with /campgrounds/:id/reviews
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);
app.use('/',userRoutes);


app.get('/',(req,res)=>{
    res.render('home');
})

/////////////////////////////////// ERROR HANDLING /////////////////////////////////////////////////

// Very important step: this should be the last route
// Every route that is not found will be handled by this route
// You must not have any route after this route
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