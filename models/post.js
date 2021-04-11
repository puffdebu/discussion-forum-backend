const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    content:{
        type: String,
        required: true,
    },
    user:{
        userId : {type: String, required: true, ref: 'User'},
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

postSchema.methods.delComment = function(commentId) {
    const newComments = this.comments.filter(c => c._id.toString() !== commentId.toString());
    this.comments = newComments;
    return this.save();
}

module.exports = mongoose.model('Post', postSchema);