const User = require('../models/Users');

const signup = async(req, res, next) => {
    try{
        
        const{username, email, password, role} = req.body

        const newUser = new User({username, email, password, role})

        await newUser.save();


        res.status(201).json({code: 201, status: true, message: "New user has been registered successfully"})



    }catch(error){
        next(error)
    }

};

module.exports = { signup };
