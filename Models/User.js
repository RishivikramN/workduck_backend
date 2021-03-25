const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true
    },
    EmailId: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    }
},
{ timestamps: true});

const User = mongoose.model("Users",UserSchema);

module.exports.User = User;