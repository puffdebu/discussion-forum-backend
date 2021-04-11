const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    host : {
        type : String,
        required : true,
        ref : 'User',
    },
    startTime : {
        type : Date,
        required : true,
    },
    endTime : {
        type : Date,
        required : true,
    },
    subject : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    }
});

module.exports = mongoose.model('Event',eventSchema)