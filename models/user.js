// Key: For authentication and authorization, 
// we will use the passport-local-mongoose 
// plugin to simplify the process of setting up a username and password for the user. This plugin will also help us to authenticate the user and store the user details in the MongoDB database. We will create a new file named user.js in the models folder and add the following code to it:
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);