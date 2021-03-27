const express = require('express');
const {Train} = require('../Models/Train');
const {SeatBookingDetail} = require('../Models/SeatBookingDetail');
const {getDayOfWeek,getFullNameOfWeekDay} = require('../Utils/DateUtilities');
const router = express.Router();

//GET Method
router.get('/livestatus/:id',async(req,res)=>{
    try {
        const trainId = req.params.id;
        const currentSystemDate = new Date("Mon Apr 26 2021 15:37:00 GMT+0530 (India Standard Time)");
        const currentWeekDay = getDayOfWeek(currentSystemDate);
        const currentTime = currentSystemDate.toTimeString();

        const train = await Train.findById(trainId);
        
        if(!train.TrainWeekDaySchedule.includes(currentWeekDay))
            res.status(400).send(`${train.TrainCode}-${train.TrainName} will not run on ${getFullNameOfWeekDay(currentWeekDay)}'s`);
        //Assigning possible minimum date
        let prevTrainStationDepartureTime = new Date("01/01/1000");
        let prevTrainStation = "";
        let output = {
            from: "",
            to: "",
            standby:""
        };

        if(currentTime >= new Date(train.TrainStations[train.TrainStations.length - 1].ArrivalTime).toTimeString())
        {
            output={
                from: "",
                to: "",
                standby: train.TrainStations[train.TrainStations.length - 1].StationCode
            }   
            res.send(output);
            return;
        }

        for (const trainstation of train.TrainStations) {
            const stationArrivalTime = new Date(trainstation.ArrivalTime).toTimeString();
            const stationDepartureTime = new Date(trainstation.DepartureTime).toTimeString();

            if(stationArrivalTime < currentTime && stationDepartureTime > currentTime)
            {
                output = {
                    from: "",
                    to: "",
                    standby: trainstation.StationCode
                }
                res.send(output);
                return;
            }
        }

        for (const trainstation of train.TrainStations) {

            const stationArrivalTime = new Date(trainstation.ArrivalTime).toTimeString();
            const prevStationTime = prevTrainStationDepartureTime.toTimeString();

            if(stationArrivalTime > currentTime && prevStationTime <= currentTime)
            {
                if(prevTrainStation)
                    output = {
                        from : prevTrainStation,
                        to : trainstation.StationCode,
                        standby: ""
                    }
                else
                    output = {
                        from: "",
                        to: "",
                        standby: trainstation.StationCode
                    }
            }
            prevTrainStation = trainstation.StationCode;
            prevTrainStationDepartureTime = new Date(trainstation.DepartureTime);
        }
        
        res.send(output);

    } catch (error) {
        console.log(error);
    }
});
router.get('/getbookinghistory/:id',async (req,res)=>{
    try {
        let bookedSeats=[];
        let output = [];
        const userId = req.params.id;
        const seatbookingdetails = await SeatBookingDetail.find({
            UserId: userId
        });
        
        for (const seatbookingdetail of seatbookingdetails) {
            bookedSeats=[];
            let train = await Train.findById(seatbookingdetail.TrainId);
            for (const seatid of seatbookingdetail.SeatId) {
                for (const trainseat of train.Seats) {
                    if(seatid.equals(trainseat._id))
                        bookedSeats.push(trainseat);
                }
            }
            output.push({
                TrainName: train.TrainName,
                TrainCode: train.TrainCode,
                Seats: bookedSeats,
                BookingDate: seatbookingdetail.BookingDate
            });
        }
        
        res.send(output);
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
                {
                    $and:[
                        {
                            "TrainStations.StationCode" : fromStation
                        },
                        {
                            "TrainStations.StationCode" : toStation
                        }
                    ]
                }
            );
            
            for (const train of trains) {
                let fromStationSeqNum = 0;
                let toStationSeqNum = 0;

                for (const trainstation of train.TrainStations) {
                    if(trainstation.StationCode == fromStation)
                        fromStationSeqNum = trainstation.SequenceNumber;
                    if(trainstation.StationCode == toStation)
                        toStationSeqNum = trainstation.SequenceNumber;
                }

                if((fromStationSeqNum < toStationSeqNum) && train.TrainWeekDaySchedule.includes(weekday))
                    output.push(train);
            }

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