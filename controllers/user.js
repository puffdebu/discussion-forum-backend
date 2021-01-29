const mongoose = require('mongoose');
const User = require('../models/user');
// const Upvoter = require('../models/upvoter');

exports.createUser = (req,res,next) => {
    const userId = req.body.userId;
    const name = req.body.name;
    let user = new User({_id: userId,name: name});
    user.save()
    .then(() => {
        res.json({message : 'User created successfully'});
    })
    .catch(err => {
        res.status(400).json({message : 'Error while storing user in database.'});
    });
};

exports.getInfo = (req,res,next) => {
    const userId = req.params.userId;
    const userName = req.params.userName;
    console.log(userId);
    User.findById(userId)
        .then(resp => {
            if(!resp){
                let user = new User({_id: userId, name: userName});
                return user.save();
            }
            else 
            return Promise.resolve(resp);
        })
        .then(user => {
            res.status(200).json({name : user.name,userId : user.id});
        })
        .catch((err) => {
            res.status(400).json({message : 'Sorry couldn\'t fetch user details'});
        });
};
