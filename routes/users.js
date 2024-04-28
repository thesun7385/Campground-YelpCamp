const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync"); // key: path from current directory to the catchAsync file
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const User = require("../models/user");
const users = require("../controllers/users");
const user = require("../models/user");

////// Hide Register for Live Demo
router
  // .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register));

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

// GET /logout route
router.get("/logout", users.logout);

module.exports = router;
