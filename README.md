# 2024 YelpCamp
YelpCamp is a comprehensive web development project commonly used as a learning resource in web development courses or tutorials. The project is designed to guide individuals, especially beginners, through the process of creating a fully functional web application with features typically found in a campground review website. 

## Table of contents
- Basic Features
- Tools and Frameworks
- Installation Steps
- Running the Application
- License

## Basic Features
* Campground Listings
* User Authentication
* Campground Reviews and Ratings
* CRUD Operations
* Image Uploads
* Responsive Design
* Backend Technologies
* RESTful Routes
  
 <p align="center">
  <img src="https://res.cloudinary.com/dwsihr9yg/image/upload/v1707702592/web-screenshots/elotc537lyfb3gdhppqe.jpg" alt="Campground">  
   <img src="https://res.cloudinary.com/dwsihr9yg/image/upload/v1707702592/web-screenshots/qiwxaiugfn4jv178gr4y.jpg" alt="Campground">
 </p>


## Tools and Frameworks
- [MongoDB](https://www.mongodb.com/): MongoDB serves as the database for Yelp Camp
- [express](https://expressjs.com//): Express is a fast and minimalist web framework for Node.js
- [Node.js](https://nodejs.org): Node.js is the JavaScript runtime that powers the server-side of Yelp Camp
- [Bootstrap](https://getbootstrap.com/): Bootstrap is a front-end framework used to enhance the visual appeal and responsiveness of the Yelp Camp

## Installation Steps
1. Clone the Repository
   ```
   git clone https://github.com/thesun7385/Campground-YelpCamp.git
   ```
2. Navigate to the Project Directory
   ```
   cd Campground-YelpCamp
   ```
3. Install Dependencies
   ```
   npm install
   ```
4. Set Up MongoDB
- Make sure MongoDB is installed and running on your local machine.
- Create a MongoDB database for Yelp Camp and configure the connection in the project.

5. Cloudinary Configuration:
- Register for a Cloudinary account if you don't have one.
- Obtain your Cloudinary API key, API secret, and cloud name.
- Add the Cloudinary configuration to your .env file.

6. Mapbox Configuration:
- Sign up for a Mapbox account and obtain an API key.
- Add the Mapbox API key to your .env file.

7. Environment Variables:
- Create a .env file in the project root for sensitive information like database connection details and Cloudinary API keys.
- Example .env file:
   ```
  COULDINARY_CLOUD_NAME = your-cloud-name
  COULDINARY_KEY =  your-key
  COULDINARY_SECRET = your-secret
  MAPBOX_TOKEN = your-token  
  DB_URL = mongodb://localhost:27017/your-database-name
   ```
## Running the Application

1. Start the server locally
   ```
   npm start
   ```
2. Visit the Local Website
- Open your web browser and go to http://localhost:3000

3. Explore Yelp Camp !!
   
   
## License
Yelp Camp Project - Part of Colt Steele's Tutorial
(c) [2024] Supachai Ruknuy

This project is a part of the "Web Developer Bootcamp" tutorial by Colt Steele. The original tutorial content and guidelines are the intellectual property of Colt Steele.

As a learner and contributor to the Yelp Camp project within the context of Colt Steele's tutorial, you are granted the following rights:

You are free to use, modify, and distribute the codebase for educational purposes.
Attribution to Colt Steele and the tutorial is required in any derivative work or distribution.
Attribution:

The original tutorial: [Web Developer Bootcamp](https://www.udemy.com/course/the-web-developer-bootcamp/?kw=web&src=sac)
Instructor: Colt Steele

Note:
This license is specific to the context of Colt Steele's tutorial. For any use beyond the scope of the tutorial or if you intend to distribute the project outside of educational purposes, please refer to the terms and conditions provided by Colt Steele or seek appropriate permission


