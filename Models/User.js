const mongoose = require('mongoose');

const BookingHistoriesSchema = new mongoose.Schema({
    TrainId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    SeatId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}); 

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
    BookingHistories: []
});

const User = mongoose.model("Users",UserSchema);

module.exports.User = User;