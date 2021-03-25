const mongoose = require('mongoose');

const TrainRouteSchema = new mongoose.Schema({
    StationCode : {
        type: String,
        required: true
    },
    StationName: {
        type: String,
        required: true
    }
});

const TrainRoute = mongoose.model("TrainRoutes",TrainRouteSchema);

module.exports.TrainRoute = TrainRoute;