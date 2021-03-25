const mongoose = require('mongoose');
const config = require('../Config/config.json');
const jwt = require("jsonwebtoken");

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

UserSchema.methods.generateAuthToken = ()=>{
    const token = jwt.sign({_id:this._id},config.jwtkey);
    return token;
};

const User = mongoose.model("Users",UserSchema);

module.exports.User = User;