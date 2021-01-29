// const { Op } = require('sequelize');
const User = require('../models/user');
const Post = require('../models/post');
const mongooose = require('mongoose');
// const user = require('../models/user');

exports.fetchUserPosts = (req,res,next) =>{
    let response =[];
    Post.find()  
    .then(posts =>{
        console.log(posts);
        posts.forEach(post =>{
            let postInfo = {
                userId: post.user.userId,
                postId: post._id,
                name: post.user.userName,
                content: post.content
            }
            response.push(postInfo);
            
        })
        res.json(response);
    })
    .catch((err) => {
        console.log(err);
        res.status(400).json({message : 'Some problem in fetching posts!'})
    });

}

// exports.postComment = (req,res,next) => {
//     let userId= req.body.userId;
//     let content = req.body.content;
//     let postId= req.body.postId;

//     User.findByPk(userId)
//     .then( user => {
//         return user.createComment({
//             upvotes : 0,
//             content: content,
//             postId: postId
//         })
//     })
//     .then(result =>{
//         console.log(result);
//         res.status(200).json({message : 'Post created successfully'});
//     })
//     .catch(err =>{
//         console.log(err);
//         res.status(400).json({message : 'Problem creating the post.'})
//     });

// };

exports.postComment = (req,res,next) => {
    let userId= req.body.userId;
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
       console.log('post: ', post);
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
    const userId = req.body.userId;
    const content = req.body.content;
    User.findById(userId)
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


// exports.searchKeyWord = (req,res) => {
//     const keyword = req.params.keyword;
//     const options = {
//         where : {
//             content : {
//                [Op.like] :  '%' + keyword + '%',    
//             } 
//         }
//     };
//     Post.findAll(options)
//         .then(resp => {
//             console.log(resp);
//             res.json('Hello');
//         })
//         .catch(err => {
//             console.log(err);
//         });
// };



// exports.upvoteHandler = (req,res,next) => {
//     const commentId = req.body.commentId;
//     const userId= req.body.userId;
//     let updateNeeded =0;
//         Upvoter.findByPk(userId, {include: "comments"})
//         .then(upvoter =>{
//                 let targetComment= upvoter.comments.find(comment => comment.id===commentId);
//                 if(!targetComment){
//                     updateNeeded=1;
//                     return Action.create({
//                         upvoterId : userId,
//                         commentId : commentId,
//                         upvoted : true,
//                         downvoted : false,
//                     });
//                 }
    
//                 else {
//                     let upvoted = targetComment.action.upvoted;
//                     let downvoted = targetComment.action.downvoted;
//                     if(upvoted){
//                         upvoted=false;
//                         updateNeeded=-1;
//                     }
//                     else if(downvoted){
//                         downvoted=false;
//                         upvoted = true;
//                         updateNeeded=2;
//                     }
//                     else {
//                         upvoted = true;
//                         updateNeeded=1;
//                     }
//                     return Action.findAll({where : {commentId : commentId,upvoterId : userId}})
//                             .then(([action]) => {
//                                 action.upvoted = upvoted;
//                                 action.downvoted = downvoted;
//                                 return action.save();
//                             });
//                 }            
//         })
//         .then(() =>{
//             return Comment.findByPk(commentId)
//                     .then(comment => {
//                         comment.upvotes+=updateNeeded;
//                         return comment.save();
//                     })
//         })
//         .then(() =>{
//             res.json({message: "Upvoted!"});
//         })
//         .catch(err =>{
//             console.log(err);
//         });
    
    
// };

exports.upvoteHandler = (req,res,next) => {
    const userId = req.body.userId;
    const commentId = req.body.commentId;
    const postId = req.body.postId;
    // console.log('in upvote handler',req.body.postId);
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
    const userId = req.body.userId;
    const commentId = req.body.commentId;
    const postId = req.body.postId;
    // console.log('in upvote handler',req.body.postId);
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

// exports.downVoteHandler = (req,res,next) => {
//     // const commentId = req.body.commentId;
//     // const userId = req.body.userId;
//     // Action.findAll({where : {commentId : commentId,upvoterId : userId}})
//     //     .then(resp => {
//     //         if(resp.length === 0){
//     //             return Action.create({
//     //                 upvoterId : userId,
//     //                 commentId : commentId,
//     //                 upvoted :  false,
//     //                 downvoted : true,
//     //             });
//     //         }
//     //         else {
//     //             const [row] = resp;
//     //             if(row.downvoted) {
//     //                 row.downvoted = false;
//     //             }
//     //             else{
//     //                 row.downvoted = true;
//     //                 row.upvoted = false;
//     //             };
//     //             return row.save();
//     //         }
//     //     }).then(() => {
//     //         return Action.findAll({where : {commentId : commentId}})
//     //                 .then(rows => {
//     //                     let counter = 0;
//     //                     rows.forEach(row => {
//     //                         if(row.upvoted){
//     //                             counter ++;
//     //                         }
//     //                         if(row.downvoted){
//     //                             counter --;
//     //                         }
//     //                     })
//     //                     return Comment.findByPk(commentId)
//     //                         .then(comment => {
//     //                             comment.upvotes = counter;
//     //                             return comment.save();
//     //                         })
//     //                 })
//     //     })
//     //     .then(() => {
//     //         res.json({message : 'Comment was downvoted successfully.'});
//     //     })

//     const userId = req.body.userId;
//     const commentId = req.body.commentId;
//     let updateNeeded=0;
//     Upvoter.findByPk(userId, {include: "comments"})
//     .then(upvoter =>{
//         let targetComment= upvoter.comments.find( comment  => comment.id===commentId);
//         if(!targetComment)
//         {
//             updateNeeded-=1;
//              return  Action.create({
//                 upvoterId : userId,
//                 commentId : commentId,
//                 upvoted : false,
//                 downvoted : true,
//             });
//         }
//         else {
//             let upvoted= targetComment.action.upvoted;
//             let downvoted= targetComment.action.downvoted;
//             if(upvoted){
//                 upvoted=false;
//                 downvoted=true;
//                 updateNeeded-=2;
//             }

//             else if(downvoted){
//                 downvoted=false;
//                 updateNeeded+=1;
//             }
//             else {
//                 updateNeeded-=1;
//                 downvoted=true;
//             }
//             return  Action.findAll({where: {commentId: commentId, upvoterId: userId}})
//             .then(([action]) =>{
//                 action.downvoted=downvoted;
//                 action.upvoted=upvoted;
//                 return action.save();
//             });
//         }
//     })
//     .then(() =>{
//         return Comment.findByPk(commentId);
//     })
//     .then(comment =>{
//         comment.upvotes+=updateNeeded;
//         return comment.save();
//     })
//     .then(() =>{
//         res.json({message: "Downvoted Successfully!"});
//     })
//     .catch(err =>{
//         console.log(err);
//     })
// };


// exports.fetchDiscussionPost = (req,res,next) =>{
//     const postId= req.params.postId;
//     const userId = req.params.userId;
//     const info ={
//         postId: postId,
//         comments : [],
//     }
//     let Users =[];
//     User.findAll()
//     .then(users =>{
//         Users=users;
//         return Post.findByPk(postId);
//     })
//     .then(post =>{
//         info.content= post.content;
//         info.userId= post.userId;
//         let user= Users.find(user => user.id=== post.userId);
//         info.name= user.name;

//         return post.getComments({include : 'upvoters'});
//     })
//     .then(comments =>{
//         comments.forEach(comment =>{
//            let  obj2 = {
//                 commentId: comment.id,
//                 content : comment.content,
//                 upvotes: comment.upvotes,
//                 userId: comment.userId,
//             }
//             let upvoter = comment.upvoters.find( upvoter => upvoter.id === userId);
//             if(!upvoter){
//                 obj2.upvoted = false;
//                 obj2.downvoted= false;
//             } else {
//                 obj2.upvoted = upvoter.action.upvoted;
//                 obj2.downvoted= upvoter.action.downvoted;
//             };
//             let user= Users.find(user => user.id=== obj2.userId);
//             obj2.name= user.name;
//             info.comments.push(obj2);
        

//         });
//         res.json(info);
//     })
//     .catch(err =>{
//         console.log(err);
//     })
    
// };

exports.fetchDiscussionPost = (req,res,next) =>{
    const postId= req.params.postId;
    const userId = req.params.userId;

    const info ={comments : []};
    let loggedInUser;
    User.findById(userId)
    .then(user =>{
        loggedInUser = user;
        return Post.findById(postId);
    })
    .then(post =>{
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
    .catch(err =>{
        console.log(err);
    })
    
}