const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = require('./post.js');

const userSchema = Schema({
    name: {
        type : String, 
        required : true
    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    }
});

userSchema.methods.createPost = function(content){
    let user = {userId: this._id, userName: this.name};
    let post = new Post({content:content, user:user, comments: []});
    return post.save();
}

module.exports = mongoose.model('User', userSchema);




