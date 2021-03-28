const Joi = require('@hapi/joi');
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
        isOnDelay: Boolean,
        TrainStations : [TrainStationsSchema],
        Seats: [SeatsSchema]
    },
    { timestamps: true}
);

const Train = mongoose.model("Trains",TrainSchema);

function validateTrain(train){

    // crafting input payload
    let trainsInput = {
        TrainCode : train.TrainCode,
        TrainName : train.TrainName
    };

    const trainSchema = Joi.object(
        {
            TrainCode: Joi.string().trim().required(),
            TrainName: Joi.string().trim().required()
        }
    );

    const trainStationSchema = Joi.object().keys({
        SequenceNumber: Joi.string().trim().required(),
        StationCode: Joi.string().trim().required(),
        StationName: Joi.string().trim().required(),
        ArrivalTime: Joi.string().trim().required(),
        DepartureTime: Joi.string().trim().required()
    });

    const seatSchema = Joi.object().keys({
        SeatType: Joi.string().trim().required(),
        SeatNumber: Joi.string().trim().required(),
        Price: Joi.number().required(),
        IsBooked: Joi.bool().required()
    });

    let trainStations = Joi.array().items(trainStationSchema);
    let seats = Joi.array().items(seatSchema);

    //checking results
    let isTrainsPassed = trainSchema.validate(trainsInput);
    let isTrainStationsPassed = trainStations.validate(train.TrainStations);
    let isSeatsPassed = seats.validate(train.Seats);

    if(isTrainsPassed.error)
        return isTrainsPassed;

    if(isTrainStationsPassed)
        return isTrainStationsPassed;

    if(isSeatsPassed)
        return isSeatsPassed;
}

module.exports.Train = Train;
module.exports.validate = validateTrain;