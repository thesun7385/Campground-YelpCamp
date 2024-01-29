const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Schema
const CampgroundSchema = new Schema({
    location: String,
    title: String,
    image: String, // Make sure you have this field
    description: String,
    price: Number
});

module.exports = mongoose.model('Campground', CampgroundSchema);