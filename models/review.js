const moongose = require('mongoose');
const Schema = moongose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    price: Number,
    description: String,
    location: String,
})

// Export
module.exports = moongose.model('Review', reviewSchema);