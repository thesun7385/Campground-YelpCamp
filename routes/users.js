const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync'); // key: path from current directory to the catchAsync file
const passport = require('passport');
const { storeReturnTo } = require('../middleware'); 

// GET /register page
router.get('/register', (req, res) => {
    res.render('users/register');
})

// Send POST request to /register
router.post('/login',
    // use the storeReturnTo middleware to save the returnTo value from session to res.locals
    storeReturnTo,
    // passport.authenticate logs the user in and clears req.session
    passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),
    // Now we can use res.locals.returnTo to redirect the user after login
    (req, res) => {
        req.flash('success', 'Welcome back!');
        const redirectUrl = res.locals.returnTo || '/campgrounds'; // update this line to use res.locals.returnTo now
        delete res.locals.returnTo; // delete res.locals.returnTo
        res.redirect(redirectUrl);
    });

// GET /login page
router.get('/login', (req, res) => {
    res.render('users/login');
})

// Send POST request to /login
router.post('/login',storeReturnTo ,passport.authenticate('local',
{failureFlash: true,failureRedirect:'/login'}),(req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    //console.log(redirectUrl);
    res.redirect(redirectUrl);

})

// GET /logout route
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
            return next(err); // Pass the error to the next middleware
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
});


module.exports = router;