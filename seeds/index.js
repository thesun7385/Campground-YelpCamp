// Set up mongoose connection
const mongoose = require('mongoose');
const Campground = require('../models/campground');
// Import the cites arr, place
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');



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

// Get a random element from an array
const sample = array => array[Math.floor(Math.random()*array.length)];

// Key1:Create a function to seed the database
const seedDB = async()=>{
    await Campground.deleteMany({});
    // Loop through the cities array and create a campground
    // Using 1000 because there are 1000 cities in the cities array
    // Get 50 random cities
    for(let i=0; i<50; i++){
        const random1000 = Math.floor(Math.random()*1000);

        // Create a new campground from the cities array
        const camp = new Campground ({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }
}

// Populate the database and close the connection
seedDB().then(() =>{
    mongoose.connection.close();
})


