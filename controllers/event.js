const { validationResult } = require('express-validator');
const Event = require('../models/event');

exports.createEvent = (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array());
        const error = new Error(errors.array()[0].msg);
        error.statusCode = 422;
        throw error;
    }
    const startTimeDate = new Date(req.body.selectedDate);
    const [sh,sm] = req.body.startTime.split(':');
    startTimeDate.setHours(sh,sm);
    console.log(startTimeDate);
    const endTimeDate = new Date(req.body.selectedDate);
    const [eh,em] = req.body.endTime.split(':');
    endTimeDate.setHours(eh,em);
    console.log(endTimeDate);
    const newEvent = new Event({
        subject : req.body.subject,
        description : req.body.description,
        startTime : startTimeDate,
        endTime : endTimeDate,
        host : req.userId,
    });
    newEvent.save()
        .then(() => {
            res.status(201).json({message : 'New event was successfully created.'})
        })
        .catch(err => {
            console.log(err);
            if(!err.statusCode){
                err.statusCode = 500;
                err.message = 'Internal server error.'
            }
            next(err);
        })
    
};

exports.fetch = (req,res,next) => {
    Event.deleteMany({startTime : {$lt : new Date()}})
        .then(resp => {
            return Event.find();
        })
        .then(events => {
            const promiseArr = [];
            for(let event of events){
                promiseArr.push(event.populate('host').execPopulate());
            }
            return Promise.all(promiseArr);
        })
        .then(events => {
            const finalEvents = [];
            events.forEach(event => {
                    finalEvents.push({
                        id : event._id.toString(),
                        createdBy : event.host.name,
                        topic : event.subject,
                        description : event.description,
                        startTime : event.startTime.toString(),
                        endTime : event.endTime.toString(),
                    });
            })
            res.status(200).json({events : finalEvents});
        }).catch(err => {
            console.log(err);
            if(!err.statusCode){
                err.statusCode = 500;
                err.message = 'Internal server error.';
            }
            next(err);
        })

}