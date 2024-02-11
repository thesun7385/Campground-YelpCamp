// Set up mongoose connection
const mongoose = require("mongoose");
const Campground = require("../models/campground");
// Import the cites arr, place
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

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
const sample = (array) => array[Math.floor(Math.random() * array.length)];

// Key1:Create a function to seed the database
const seedDB = async () => {
  await Campground.deleteMany({});
  // Loop through the cities array and create a campground
  // Using 1000 because there are 1000 cities in the cities array
  // Get 200 random cities
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    // Create a new campground from the cities array
    const camp = new Campground({
      // Your userID
      // user:tim1, pw:tim1
      author: "65bfdf7070a26aa70446b832",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      //image: "https://source.unsplash.com/collection/483251",
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Assumenda nesciunt non autem possimus maiores, perferendis minima ipsum qui nulla et facere tempore vel consequuntur hic quidem id voluptatem. Necessitatibus, debitis!",
      price,
      images: [
        {
          url: "https://res.cloudinary.com/dwsihr9yg/image/upload/v1707459228/YelpCamp/jjvbp2kc7qahvqxmwn38.jpg",
          filename: "YelpCamp/jjvbp2kc7qahvqxmwn38",
        },
        {
          url: "https://res.cloudinary.com/dwsihr9yg/image/upload/v1707450370/YelpCamp/q0xndghmjzknd1djkp90.jpg",
          filename: "YelpCamp/q0xndghmjzknd1djkp90",
        },
      ],
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
    });
    await camp.save();
  }
};

// Populate the database and close the connection
seedDB().then(() => {
  mongoose.connection.close();
});
