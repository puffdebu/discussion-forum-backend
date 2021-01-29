// const Sequelize = require('sequelize');
// const sequelize = require('../utils/database');


// const Post = sequelize.define('post',{
//     id : {
//         type : Sequelize.INTEGER,
//         allowNull : false,
//         autoIncrement : true,
//         primaryKey : true,
//     },
//     content : Sequelize.TEXT,
// });

// module.exports = Post;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

postSchema = Schema({
    content:{
        type: String,
        required: true,
    },
    user:{
        userId: {type: String, required: true, ref: 'User'},
        userName: {type: String, required: true, ref: 'User'}
    },
    comments: [{
        content:{
            type: String,
            required: true,
        },
        
        user:{
            userId: {type: String, required: true, ref: 'User'},
            userName: {type: String, required: true, ref: 'User'}
        },
        upvotes: {
            count : {type: Number, default: 0},
            users :[{
                userId : {type: String, ref:'User', required:true},
                upvoted : {type: Boolean, default: false},
                downvoted : {type: Boolean, default: false}
            }]
        }
    }]

});

module.exports = mongoose.model('Post', postSchema);