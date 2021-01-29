// const Sequelize = require('sequelize');
// const sequelize = require('../utils/database');

// const User = sequelize.define('user',{
//     id : {
//         type : Sequelize.STRING,
//         allowNull : false,
//         primaryKey : true,
//     },
//     name : Sequelize.STRING,
// });

// module.exports = User;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = require('./post.js');

userSchema = Schema({
    _id : {
        type: String,
        required : true
    },
    name: {
        type : String, 
        required : true
    }
    
});

userSchema.methods.createPost = function(content){
    let user = {userId: this._id, userName: this.name};
    let post = new Post({content:content, user:user, comments: []});
    return post.save();
}

module.exports = mongoose.model('User', userSchema);




