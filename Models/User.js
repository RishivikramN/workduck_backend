const mongoose = require('mongoose');

const BookingHistoriesSchema = new mongoose.Schema({
    TrainId : {
        type: mongoose.Schema.Types.ObjectId
    },
    SeatId : {
        type: mongoose.Schema.Types.ObjectId
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
    BookingHistories: [BookingHistoriesSchema]
});

const User = mongoose.model("Users",UserSchema);

module.exports.User = User;