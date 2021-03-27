const mongoose = require('mongoose');

//Defining Schema for Schedule Model
const TrainStationsSchema = new mongoose.Schema(
    {
        SequenceNumber: {
            type: String,
            required: true
        },
        StationCode : {
            type: String,
            required: true
        },
        StationName: {
            type: String,
            required: true
        },
        ArrivalTime: {
            type: String,
            required: true
        },
        DepartureTime: {
            type: String,
            required: true
        }
    }
);

//Defining Schema for Seats
const SeatsSchema = new mongoose.Schema({
    SeatType: {
        type: String,
        required: true
    },
    SeatNumber: {
        type: String,
        required: true
    },
    Price: {
        type: Number,
        required: true
    },
    IsBooked: {
        type: Boolean,
        required: true
    }
});

// Defining Schema for Train Model (Parent Schema)
const TrainSchema = new mongoose.Schema(
    {
        TrainCode : {
            type: String,
            required: true
        },
        TrainName : {
            type: String,
            required: true
        },
        TrainWeekDaySchedule: {
            type: [String],
            enum: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
            required: true
        },
        TrainStations : [TrainStationsSchema],
        Seats: [SeatsSchema]
    },
    { timestamps: true}
);

const Train = mongoose.model("Trains",TrainSchema);

module.exports.Train = Train;
