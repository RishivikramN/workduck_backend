const express = require('express');
const {TrainRoute} = require('../Models/TrainRoute');

const router = express.Router();

//GET method
//Returns all the train routes from the database
router.get('/',async (req,res)=>{
    try {
        const trainroutes = await TrainRoute.find();
        
        res.send(trainroutes);
    } catch (error) {
        console.log(error);
    }   
});

//POST Method
// Creates new routes in the database
router.post('/',async (req,res)=>{
    try {
        const trainroute = new TrainRoute({
            StationCode: req.body.StationCode,
            StationName: req.body.StationName
        });

        const output = await trainroute.save();

        res.send(output);
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
