const mongoose = require('mongoose');

//Defining Schema for SeatBookingDetail
const SeatBookingDetailSchema = new mongoose.Schema({
    BookingDate: {
        type: Date
    },
    UserId: {
        type: mongoose.Schema.Types.ObjectId
    },
    TrainId: {
        type: mongoose.Schema.Types.ObjectId
    },
    SeatId: {
        type: [mongoose.Schema.Types.ObjectId]
    }
});

const SeatBookingDetail = mongoose.model("SeatBookingDetails",SeatBookingDetailSchema);

module.exports.SeatBookingDetail = SeatBookingDetail;