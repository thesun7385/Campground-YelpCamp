const mongoose = require('mongoose');
const { campgroundSchema } = require('../schemas');
const Schema = mongoose.Schema;
const Review = require('./review'); // Import the Review model

// Key: Usig virtuals to get the thumbnail image
const ImageSchema = new Schema({
    url: String,
    filename: String
});

// Add a virtual to get the thumbnail image
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

// Define Schema
const CampgroundSchema = new Schema({
    location: String,
    title: String,
    description: String,
    price: Number,
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    author:{
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
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

  //console.log(`Deleted Camground Title: ${doc.title}`);
})

module.exports = mongoose.model('Campground', CampgroundSchema);