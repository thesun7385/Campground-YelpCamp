const mongoose = require('mongoose');
const { campgroundSchema } = require('../schemas');
const Schema = mongoose.Schema;
const Review = require('./review'); // Import the Review model

// Define Schema
const CampgroundSchema = new Schema({
    location: String,
    title: String,
    image: String, // Make sure you have this field
    description: String,
    price: Number,
    reviews: [
        {
            // object ID from the review model
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

// Very important method!!!
// Middleware to delete the reviews when the campground is deleted
CampgroundSchema.post('findOneAndDelete', async function (doc) {
  if(doc){

    await Review.deleteMany({
      _id:{
        $in: doc.reviews
      }
    })
  }

  console.log(`Deleted Camground Title: ${doc.title}`);
})

module.exports = mongoose.model('Campground', CampgroundSchema);