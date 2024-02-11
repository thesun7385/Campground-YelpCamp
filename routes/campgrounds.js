const express = require("express");
const router = express.Router();

// Multer for file uploads
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

// refer current directory to required path
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const campgrounds = require("../controllers/campgrounds");

const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

//////////////////////////////// Campground Routes ////////////////////////////////
// Key: using express property to group the routes
// validate login first
router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.createCampground)
  );

router.get("/new", isLoggedIn, campgrounds.rendernewForm);

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  ) // for edit
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

/////////////////// Export the router
module.exports = router;
