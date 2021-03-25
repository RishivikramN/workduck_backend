const express = require('express');
const bcrypt = require("bcrypt");
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

        if(!user) return res.status(400).send("No User were found with the given Id");

        res.send(user);
    } catch (error) {
        console.log(error);
    }
})

//POST Method
router.post("/registeruser",async (req,res)=>{
    try{
        const isUserAlreadyExists = await User.findOne({ EmailId: req.body.emailId });

        if(isUserAlreadyExists) return res.send({error:"Email already exists"});

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            Username: req.body.userName,
            EmailId: req.body.emailId,
            Password: password
        });

        const result = await user.save();

        const response = {
            userName: result.Username,
            emailId: result.EmailId
        }

        res.send(response);

    }
    catch(ex){
        console.log(ex);
    }
    
});

router.post('/signinuser',async (req,res)=>{
    try {

        const user = await User.findOne({ EmailId: req.body.emailId });
        if (!user) return res.status(400).send("Invalid Email Id or Password");

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.Password
        );

        if (!validPassword) return res.status(400).send("Invalid Email or Password");
        
        res.send({token : user.generateAuthToken(), username: user.UserName});

    } catch (ex) {
        console.log(ex);
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

        if(!user) return res.status(400).send("No User were found with the given Id");

        res.send(user);
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;