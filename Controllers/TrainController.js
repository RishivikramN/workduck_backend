const express = require('express');
const {Train} = require('../Models/Train');
const {SeatBookingDetail} = require('../Models/SeatBookingDetail');
const {getDayOfWeek} = require('../Utils/DateUtilities');
const router = express.Router();

//GET Method
router.get('/getbookinghistory/:id',async (req,res)=>{
    try {
        let bookedSeats=[];
        const userId = req.params.id;
        const seatbookingdetail = await SeatBookingDetail.find({
            UserId: userId
        });
        const train = await Train.findById(seatbookingdetail[0].TrainId);
        seatbookingdetail[0].SeatId.forEach(
            (bookedseatid)=>{
                train.Seats.forEach(
                    (trainseat)=>{
                        if(bookedseatid.equals(trainseat._id)){
                            bookedSeats.push(trainseat);
                        }
                    }
                )
            }
        );
        res.send({
            TrainName: train.TrainName,
            TrainCode: train.TrainCode,
            Seats: bookedSeats
        });
    } catch (error) {
        console.log(error);
    }
});
router.get('/:from-:to-:date',async (req,res) => {
    try {
        const weekday = getDayOfWeek(req.params.date);
        const fromStation = req.params.from;
        const toStation = req.params.to;
        
        if((fromStation && toStation) && (fromStation === toStation))
            return res.status(400).send("From and To station cannot be same");

        let trains=[];

        if(weekday && fromStation && toStation){
            let output = [];
            trains = await Train.find(
                {'TrainStations.StationCode' : fromStation}
            );
            trains.forEach(
                (train)=>{
                    if(train.TrainStations[0].StationCode === fromStation 
                        && train.TrainStations[train.TrainStations.length-1].StationCode === toStation
                        && train.TrainWeekDaySchedule.includes(weekday)){
                            
                        output.push(train);
                    }
                }
            );

            trains = output;
        }
            
        if(!weekday || !fromStation || !toStation)
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

router.get('/getseatbooking/:userid-:trainid-:seatid',async (req,res)=>{
    const userId = req.params.userid;
    const seatId = req.params.seatid;
    const trainId = req.params.trainid;

    const bookingDetail = await SeatBookingDetail.find(
        {
            UserId : userId,
            TrainId : trainId,
            SeatId : seatId
        }
    )

    res.send(bookingDetail);
});

//POST Method
router.post('/bookseat',async (req, res)=>{
    try {
        const bookedSeatIds = req.body.BookedSeatIds;
        let output;

        bookedSeatIds.forEach(
            async (bookedSeatId) => {
               let train =  await Train.findById(req.body.TrainId);
               let seat = train.Seats.id(bookedSeatId);
               seat.IsBooked = true;
               output = await train.save();
            }
        );

        const seatbookingdetail = new SeatBookingDetail({
            BookingDate: req.body.BookingDate,
            UserId: req.body.UserId,
            TrainId: req.body.TrainId,
            SeatId: bookedSeatIds
            });

        await seatbookingdetail.save();

        res.send(output);
    } catch (error) {
        console.log(error);
    }
});

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