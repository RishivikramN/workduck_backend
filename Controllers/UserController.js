const express = require('express');
const {User} = require('../Models/User');

const router = express.Router();

//GET Method
router.get('/', async (req,res)=>{
    try {
        const users = await User.find();
        
        res.send(users);
    } catch (error) {
        console.log(error);
    }   
});


router.get('/:id',async (req,res)=>{
    try {
        const user = await User.findById(req.params.id);

        if(!user) return res.status(400).send("No Train were found with the given Id");

        res.send(user);
    } catch (error) {
        console.log(error);
    }
})

//POST Method
router.post('/',async (req,res)=>{
    try {
        const user = new User({
            Username: req.body.Username,
            EmailId: req.body.EmailId,
            Password: req.body.Password,
            BookingHistories: req.body.BookingHistories
        });

        const output = await user.save();

        res.send(output);
    } catch (error) {
        console.log(error);
    }
});

//PUT Method
router.put('/:id',async (req,res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id,
            {
                Username: req.body.Username,
                EmailId: req.body.EmailId,
                Password: req.body.Password,
                BookingHistories: req.body.BookingHistories
            },
            { new:true}
            );

        if(!user) return res.status(400).send("No Train were found with the given Id");

        res.send(user);
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;