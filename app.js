const express = require('express');
const app = express();  // create express app
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');  


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
app.use(methodOverride('_method'));  // for PUT request

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

app.get('/campgrounds', async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds}); // pass in campgrounds
})

// Make sure this route /new come before /:id
app.get('/campgrounds/new',(req,res)=>{
  res.render('campgrounds/new');
})

app.post('/campgrounds',async (req,res)=>{
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);

})


app.get('/campgrounds/:id',async (req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground});
})

app.get('/campgrounds/:id/edit',async (req,res)=>{
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', {campground});
})

app.put('/campgrounds/:id',async (req,res)=>{
  const {id} = req.params;
  /// Using ... spread operator for objects
  const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
  res.redirect(`/campgrounds/${campground._id}`); 
})

app.delete('/campgrounds/:id',async (req,res)=>{
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
})


// Start express server on port 3000
app.listen(3000, () => {
    console.log('server started on port 3000');
})