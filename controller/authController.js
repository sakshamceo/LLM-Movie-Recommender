// Request Response Handlers for Auth routes
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/UserSchema');
const jwt = require('jsonwebtoken');

// Register User
exports.register = async (req, res) => {
    console.log(req.body)
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }
    try {
        // 1. check if user exits already
        const { name, email, password} = req.body;
        let exitinguser = await User.findOne({ email: email });
        if (exitinguser) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }
        // encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // send to DB
        const user = await User.create({
            name:name,
            email:email,
            password:hashedPassword,
        });

        // Creates a new token and store 
        const token = jwt.sign(
            { userId: user._id }, //payload
            process.env.JWT_SECRET, // It's Signatuere
            { expiresIn: "7d" } // metadata
        );

        res.status(201).json({
            message:`user Successfully Created ${user}`,
            token});
    }
    catch (err) {
        console.error(`Error in User Controller: ${err}`);
        res.status(500).send(`Server Error in User Controller:  ${err}`);
    }
}
// Login User
exports.login = async (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()});
    }
    try{
        //1. check if user exists
        const {email, password} = req.body;
        const existingUser = await User.findOne({email:email})
        if(!existingUser){
            return res.status(400).json({error : "User Not Found"})
        }
        // 2. match password
        const matchPassword = await bcrypt.compare(password , existingUser.password);
        if(!matchPassword){
            return res.status(400).json({error : "Password Mismatch"})
        }
        // 3. generate jwt token and send
         const token = jwt.sign(
                    { userId: existingUser._id }, //payload
                    process.env.JWT_SECRET, // It's Signatuere
                    { expiresIn: "7d" } // metadata
                );
        res.status(201).json({message:"Login Successfully",token});
    }
    catch(err){
        console.error(`Error in Auth Controller: ${err}`);
        res.status(500).send(`Server Error in Auth Controller:  ${err}`);
    }
}
