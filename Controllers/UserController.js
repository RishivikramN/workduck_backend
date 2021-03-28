const express = require('express');
const bcrypt = require("bcrypt");
const {User,validate} = require('../Models/User');
const auth = require("../Middlewares/AuthUser");
const admin = require("../Middlewares/AuthAdmin");

const router = express.Router();

//GET Method
router.get('/',[auth,admin], async (req,res)=>{
    try {
        const users = await User.find();
        
        res.send(users);
    } catch (error) {
        console.log(error);
    }   
});


router.get('/:id',[auth,admin],async (req,res)=>{
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
        const { error } = validate(req.body);

        if (error) return res.status(400).send(error.details[0].message);

        const isUserAlreadyExists = await User.findOne({ EmailId: req.body.emailId });

        if(isUserAlreadyExists) return res.send({error:"Email already exists"});

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            Username: req.body.userName,
            EmailId: req.body.emailId,
            Password: password,
            isAdmin: req.body.isAdmin
        });

        const result = await user.save();

        const response = {
            userName: result.Username,
            emailId: result.EmailId,
            userId: result._id,
            isAdmin: result.isAdmin
        }

        res.send(response);

    }
    catch(ex){
        console.log(ex);
    }
    
});

router.post('/signinuser',async (req,res)=>{
    try {

        //Assigning dummy username for passing validation
        req.body.userName = "Dummy";

        const { error } = validate(req.body);

        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ EmailId: req.body.emailId });
        if (!user) return res.status(400).send("Invalid Email Id or Password");

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.Password
        );

        if (!validPassword) return res.status(400).send("Invalid Email or Password");
        
        res.send({token : user.generateAuthToken(), username: user.Username, userId: user._id, isAdmin: user.isAdmin});

    } catch (ex) {
        console.log(ex);
    }
});

module.exports = router;