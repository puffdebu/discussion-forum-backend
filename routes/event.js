const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middleware/isAuth');
const router = express.Router();
const eventController = require('../controllers/event');


router.get('/',isAuth,eventController.fetch);

router.post('/create',isAuth,[
    body('subject')
    .isLength({min : 4})
    .withMessage('The topic should be atleast 4 characters long.'),
    body('description')
    .isLength({min : 5})
    .withMessage('The description should be atleast 5 characters long.'),
    body('selectedDate')
    .isDate()
    .withMessage('Please enter a valid date.'),
    body('startTime')
    .isLength({min : 5})
    .withMessage('Please enter a valid start time.'),
    body('endTime')
    .isLength({min : 5})
    .withMessage('Please enter a valid end time')
    .custom((value,{req}) => {
        e = value.toString();
        s = req.body.startTime.toString();
        ss = parseInt(s.split(':')[0]);
        ee = parseInt(e.split(':')[0]);
        console.log(ss);
        console.log(ee);
        console.log(s === e);
        if(s === e || ee < ss){
            throw new Error('Please enter a valid end time');
        }
        else
        return "resolved."
    })
],eventController.createEvent);


module.exports = router;