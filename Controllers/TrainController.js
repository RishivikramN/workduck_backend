const express = require('express');
const {Train} = require('../Models/Train');
const {getDayOfWeek} = require('../Utils/DateUtilities');
const router = express.Router();

//GET Method
router.get('/',async (req,res) => {
    try {
        const weekday = getDayOfWeek(req.query.date);
        let trains;
        
        if(weekday)
            trains = await Train.find({
                TrainWeekDaySchedule : weekday
            });
        
        if(!weekday)
            trains = await Train.find();

        res.send(trains);
    } catch (error) {
        console.log(error);
    }   
});

router.get('/:id',async (req,res)=>{
    try {
        const train = await Train.findById(req.params.id);

        if(!train) return res.status(400).send("No Train were found with the given Id");

        res.send(train);
    } catch (error) {
        console.log(error);
    }
})

//POST Method
router.post('/',async (req,res)=>{
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

//PUT Method
router.put('/:id',async (req,res) => {
    try {
        const train = await Train.findByIdAndUpdate(req.params.id,
            {
                TrainCode: req.body.TrainCode,
                TrainName: req.body.TrainName,
                TrainWeekDaySchedule: req.body.TrainWeekDaySchedule,
                TrainStations: req.body.TrainStations,
                Seats: req.body.Seats
            },
            { new:true}
            );

        if(!train) return res.status(400).send("No Train were found with the given Id");

        res.send(train);
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;