const User = require('../models/user');
const { storeReturnTo } = require('../middleware'); 

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}


module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds'; // update this line to use res.locals.returnTo now
    delete res.locals.returnTo; // delete res.locals.returnTo
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
            return next(err); // Pass the error to the next middleware
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}
