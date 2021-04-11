const User = require('../models/user');
const Post = require('../models/post');

exports.fetchUserPosts = (req,res,next) =>{
    let response =[];
    Post.find()
    .then(posts =>{
        const promiseArr = [];
        for(post of posts){
            promiseArr.push(post.populate("user.userId").execPopulate());
        }
        return Promise.all(promiseArr);
    })
    .then(posts => {
         console.log(posts);
         posts.forEach(post =>{
             let postInfo = {
                 userId: post.user.userId._id,
                 postId: post._id,
                 name: post.user.userId.name,
                 content: post.content
            }
            response.push(postInfo);
            
        })
        response.reverse();
        res.json(response);
    })
    .catch((err) => {
        console.log(err);
        res.status(400).json({message : 'Some problem in fetching posts!'})
    });

}

exports.postComment = (req,res,next) => {
    let userId = req.userId;
    let content = req.body.content;
    let postId = req.body.postId;
    let fetchedUser;
    User.findById(userId)
    .then(user => {
        fetchedUser= user;
        return Post.findById(postId)
    }) 
    .then(post =>{
       let tempComment = {
           content: content,
           user: {userId: fetchedUser._id, userName: fetchedUser.name},
           upvotes : {count: 0, users: []}
       }
       let updatedComments = [...post.comments];
       updatedComments.push(tempComment);
       post.comments = updatedComments;
       return post.save();
    })
    .then(result =>{
        console.log(result);
        res.status(200).json({message : 'Post created successfully'});
    })
    .catch(err =>{
        console.log(err);
        res.status(400).json({message : 'Problem creating the post.'})
    });
}


exports.createPost = (req,res,next) => {
    const content = req.body.content;
    User.findById(req.userId)
        .then(user => {
            return user.createPost(content);
        })
        .then(() => {
            res.status(200).json({message : 'Post created successfully'});
        })
        .catch(err => {
            console.log(err);
        });
};

exports.upvoteHandler = (req,res,next) => {
    const userId = req.userId;
    const commentId = req.body.commentId;
    const postId = req.body.postId;
    let updateNeeded = 0;
    Post.findById(postId)
    .then(post =>{
        console.log('post',post);
        let requiredCommentIndex = post.comments.findIndex(comm =>
             comm._id.toString() === commentId.toString());
        let requiredComment = post.comments[requiredCommentIndex];

        let targetUserIndex = requiredComment.upvotes.users.findIndex(user =>
            user.userId===userId);
        let targetUser = requiredComment.upvotes.users[targetUserIndex];
 
        if(targetUser){
            let upvoted = false;
            let downvoted = false;
            if(targetUser.upvoted){
                upvoted = false;
                downvoted = false;
                updateNeeded--;
            } else if(targetUser.downvoted) {
                upvoted = true;
                downvoted = false;
                updateNeeded+=2;
            }
            else {
                upvoted = true;
                downvoted = false;
                updateNeeded++;
            }
            targetUser.upvoted = upvoted;
            targetUser.downvoted = downvoted;
            requiredComment.upvotes.users[targetUserIndex] = targetUser;
        } else {
            let newUser = {
                userId : userId,
                upvoted: true,
                downvoted : false
            }
            updateNeeded++;
            requiredComment.upvotes.users.push(newUser);
        }
        requiredComment.upvotes.count+= updateNeeded;
        post.comments[requiredCommentIndex] = requiredComment;
       
        return post.save();
    })
    .then( result =>{
        res.json({message: "Upvoted!"});
    })
    .catch(err =>{
        console.log(err);
    })
}

exports.downVoteHandler = (req,res,next) => {
    const userId = req.userId;
    const commentId = req.body.commentId;
    const postId = req.body.postId;
    let updateNeeded = 0;
    Post.findById(postId)
    .then(post =>{
        let requiredCommentIndex = post.comments.findIndex(comm =>
             comm._id.toString() === commentId.toString());
        let requiredComment = post.comments[requiredCommentIndex];

        let targetUserIndex = requiredComment.upvotes.users.findIndex(user =>
            user.userId===userId);
        let targetUser = requiredComment.upvotes.users[targetUserIndex];
 
        if(targetUser){
            let upvoted = false;
            let downvoted = false;
            if(targetUser.upvoted){
                upvoted = false;
                downvoted = true;
                updateNeeded-=2;
            } else if(targetUser.downvoted) {
                upvoted = false;
                downvoted = false;
                updateNeeded++;
            }
            else {
                upvoted = false;
                downvoted = true;
                updateNeeded--;
            }
            targetUser.upvoted = upvoted;
            targetUser.downvoted = downvoted;
            requiredComment.upvotes.users[targetUserIndex] = targetUser;
        } else {
            let newUser = {
                userId : userId,
                upvoted: false,
                downvoted : true
            }
            updateNeeded--;
            requiredComment.upvotes.users.push(newUser);
        }
        requiredComment.upvotes.count+= updateNeeded;
        post.comments[requiredCommentIndex] = requiredComment;
       
        return post.save();
    })
    .then( result =>{
        res.json({message: "Upvoted!"});
    })
    .catch(err =>{
        console.log(err);
    })
}

exports.fetchDiscussionPost = (req,res,next) =>{
    const postId= req.params.postId;
    const userId = req.userId;
    const info ={comments : []};
    let loggedInUser;
    User.findById(userId)
    .then(user =>{
        loggedInUser = user;
        return Post.findById(postId);
    })
    .then(post =>{
        post.populate("user.userId").execPopulate()
            .then(({_doc}) => {
                let fetchedPost = _doc;
                let post = {
                    ...fetchedPost,
                    user : { 
                        userId : fetchedPost.user.userId._id,
                        userName : fetchedPost.user.userId.name,
                    }
                }
                console.log(post);
                info.postId= post._id;
                info.content = post.content;
                info.userId = post.user.userId;
                info.name = post.user.userName;
        
                post.comments.forEach(comment =>{
                    let temp = {
                        commentId: comment._id,
                        content: comment.content,
                        upvotes: comment.upvotes.count,
                        userId: comment.user.userId,
                        name: comment.user.userName
                    }
                    let user = comment.upvotes.users.find(u =>
                    u.userId===loggedInUser._id);
                    if(user)
                    {
                        temp.upvoted=user.upvoted;
                        temp.downvoted=user.downvoted;
                    }
                    info.comments.push(temp);
        })
        res.json(info);
        })
    })
    .catch(err =>{
        console.log(err);
    })
    
}

exports.deletePost = (req,res,next) => {
    const postId = req.body.postId;
    Post.findById(postId)
        .then(post => {
            console.log('Post',post);
            if(!post){
                const error = new Error('Invalid postId');
                error.statusCode = 404;
                throw error;
            }
            if(post.user.userId.toString() !== req.userId){
                const error = new Error('Not authorized to delete the post.');
                error.statusCode = 403;
                throw error;
            }
            return Post.findByIdAndDelete(postId);
        })
        .then(() => {
            res.status(200).json({message :'Post deleted Successfully!'})
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
                err.message = 'Internal server error!';
            }
            next(err);
        });
};

exports.deleteComment = (req,res,next) => {
    const commentId = req.body.commentId;
    const postId = req.body.postId;
    Post.findById(postId)
        .then(post => {
            if(!post){
                const error = new Error('Invalid postId');
                error.statusCode = 404;
                throw error;
            }
            const validateUser = post.comments.filter(c => c.user.userId === req.userId);
            if(!validateUser){
                const error = new Error('Not authorized to delete the comment.');
                error.statusCode = 403;
                throw error;
            }
            return post.delComment(commentId);
        })
        .then(() => {
            res.status(200).json({message : 'Comment deleted successfully'});
        })
        .catch(() => {
            if(!err.statusCode){
                err.statusCode = 500;
                err.message = 'Internal server error!';
            }
            next(err);
        })
}