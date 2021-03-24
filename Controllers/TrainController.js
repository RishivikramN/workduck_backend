const { Router } = require('express');
const express = require('express');
const {Train} = require('../Models/Train');

const router = express.Router();

router.get('/getalltrains',async (req,res) => {
    try {
        const trains = await Train.find();
        
        res.send(trains);
    } catch (error) {
        console.log(error);
    }   
});

router.post('/addtrains',async (req,res)=>{
    try {
        const train = new Train({
            TrainCode: req.body.TrainCode,
            TrainName: req.body.TrainName,
            TrainWeekDaySchedule: req.body.TrainWeekDaySchedule,
            TrainStations: req.body.TrainStations,
            Seats: req.body.Seats
        });

        const output = await train.save();

        res.send(output);
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;