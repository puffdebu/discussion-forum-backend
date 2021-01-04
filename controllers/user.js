const User = require('../models/user');
const Upvoter = require('../models/upvoter');

exports.createUser = (req,res,next) => {
    const userId = req.body.userId;
    const name = req.body.name;
    User.create({
        id : userId,
        name : name,
    }).then(() =>{
        return Upvoter.create({
            id : userId,
        });
    })
    .then(() => {
        res.json({message : 'User created successfully'});
    })
    .catch(err => {
        res.status(400).json({message : 'Error while storing user in database.'});
    });
};

exports.getInfo = (req,res,next) => {
    const userId = req.params.userId;
    console.log(userId);
    User.findByPk(userId)
        .then(resp => {
            console.log(resp);
            res.json({
                name : resp.name,
                userId : resp.id,
            });
        })
        .catch((err) => {
            res.status(400).json({message : 'Sorry could\'nt fetch user details'});
        });
};
