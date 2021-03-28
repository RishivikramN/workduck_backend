const mongoose = require('mongoose');
const config = require('../Config/config.json');
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");

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
    },
    isAdmin : Boolean
},
{ timestamps: true});

UserSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id:this._id,isAdmin: this.isAdmin},config.jwtkey);
    return token;
};

const User = mongoose.model("Users",UserSchema);

function validateUser(user){
    const schema = Joi.object(
        {
            userName: Joi.string().trim().required(),
            emailId: Joi.string().trim().email().required(),
            password: Joi.string().trim().required(),
            isAdmin: Joi.bool()
        }
    );

    return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;