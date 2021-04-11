const User = require('../models/user');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

exports.signUpHandler = (req,res,next) => {
    const userName = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email : email})
    .then(exists => {
        if(exists){
            const error = new Error('This email is already registered.');
            error.statusCode = 400;
            throw error;
        }
        return bcrypt.hash(password,12); 
    })
    .then(hashedPassword => {
        const user = new User({name : userName,password : hashedPassword,email : email});
        return user.save();
    })
    .then(createdUser => {
        const token = jwt.sign({userId : createdUser._id.toString(),userName : userName},'Diss-Kusion-FOUR-UMMM',{expiresIn : '1h'});
        res.json({message : 'User created successfully',token : token,userId : createdUser._id.toString(),userName : createdUser.name});
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err); 
    });
};

exports.loginHandler = (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;
    let u;
    User.findOne({email : email})
        .then(user => {
            if(!user){
               const error = new Error('This email is not registered.');
               error.statusCode = 404;
               throw error;
            }
            u = user;
            return bcrypt.compare(password,user.password);
        })
        .then(isMatch => {
            if(!isMatch){
                const error = new Error('Password is incorrect.');
                error.statusCode = 403;
                throw error;
            }
            return Promise.resolve(u);
        })
        .then(user => {
            const token = jwt.sign({userId : user._id.toString(),userName : user.name},'Diss-Kusion-FOUR-UMMM',{expiresIn : '1h'});
            res.status(200).json({userName : user.name,userId : user._id,token : token});
        })
        .catch((err) => {
            if(!err.statusCode){
                err.statusCode = 500;
                err.message = 'Internal Server error.'
            }
            next(err); 
        });
};
