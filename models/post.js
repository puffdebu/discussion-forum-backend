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
            type: Number,
            default:0
        }
    }]

});

module.exports = mongoose.model('Post', postSchema);