const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Upvoter = require('../models/upvoter');

// exports.addPost = (req,res,next) => {
//     const userId = req.params.userId;
//     res.render('add-post',{
//        userId : userId, 
//     });
// }

// exports.postPost = (req,res,next) => {
//     const userId = req.params.userId;
//     console.log(userId);
//     const content = req.body.postContent;
//     User.findByPk(userId)
//         .then(user => {
//             console.log(user);
//             return user.createPost({
//                 content : content,
//             });
//         })
//         .then(() => {
//             res.redirect('/');
//         })
//         .catch(err => {
//             console.log(err);
//         });
// };


exports.fetchUserPosts = (req,res,next) => {
    let users = [];
    let response = [];
    User.findAll()
        .then(fetchedUsers => {
            users= fetchedUsers;
            return Post.findAll();
        })
        .then(posts => {
            posts.forEach(post => {
                const user = users.find(u => u.id === post.userId);
                const postInfo = {
                    userId : user.id,
                    postId : post.id,
                    name : user.name,
                    content : post.content,
                };
                response.push(postInfo);
            });
            res.json(response);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({message : 'Some problem in fetching posts!'})
        });
};

// exports.fetchPosts = (req,res,next) => {
//     let users = [];
//     let finalObj = [];
//     User.findAll()
//         .then(fetchedUsers => {
//             users = fetchedUsers;
//             return  Post.findAll(); 
//         })
//         .then(posts => {
//             posts.forEach(post => {
//                 const userInfo = users.find(user => user.id === post.userId);
//                 const obj ={
//                     name : userInfo.name,
//                     email : userInfo.email,
//                     userId : userInfo.id,
//                     postId : post.id,
//                     content : post.content,
//                     comments : [],
//                 };
//                 finalObj.push(obj);
//             });
//             return Comment.findAll({include : 'upvoters'})
//         })
//         .then(comments => {
//             comments.forEach(comment => {
//                 const userInfo = users.find(user => user.id === comment.userId);
//                 const postIdIndex = finalObj.findIndex(obj => obj.postId === comment.postId);
//                 const upvoters = comment.upvoters.map(upvoter => ({
//                     upvoterId : upvoter.id,
//                 }));
//                 finalObj[postIdIndex].comments.push({
//                     id : comment.id,
//                     upvotes : comment.upvotes,
//                     content : comment.content,
//                     name : userInfo.name,
//                     email : userInfo.email,
//                     userId : userInfo.id,
//                     upvoters :upvoters,
//                 });
//             });
//             res.json(finalObj);
//         })
//         .catch(err => {
//             console.log(err);
//         });
// };



// exports.comment = (req,res,next) => {
//     res.render('add-comment');
// };


// exports.postComment = (req,res,next) => {
//     const userId = req.body.userId;
//     const postId = req.body.postId;
//     const comment = req.body.comment;
//     res.redirect(`/add-comment/${userId}/${postId}?comment=${comment}`);
// };


// exports.addComment = (req,res,next) => {
//     const userId = req.params.userId;
//     const postId = req.params.postId;
//     const comment = req.query.comment;
//     console.log('userId',userId,'postId',postId,'comment',comment);
//     Comment.create({
//         upvotes : 0,
//         content : comment,
//         postId : postId,
//         userId : userId,
//     }).then(() => {
//         res.redirect('/');
//     });
// };


// exports.checkForUser = (req,res,next) =>{
//     const userId = req.params.userId;
//     Comment.findOne({include : 'upvoters',where : {id : 2}})
//         .then(comment => {
//            // console.log('comment',comment);
//             // const upvoters = comment.upvoters;
//             return Upvoter.findByPk(userId)
//                 .then(upvoter => {
//                     return comment.addUpvoter(upvoter);
//                 });
//         })
//         .then(() => {
//             res.json({name : 'Divyansh'});
//         })
//         .catch(err => {
//             console.log(err);
//         });
// };

// // exports.addUpvote = (req,res,next) => {
// //     const userId = req.params.userId;
// //     const commentId = req.params.commentId;
// //     Comment.findOne({
// //         where : {id : commentId},
// //         include : 'upvoter',
// //         })
// //         .then(comment => {
// //              console.log(comment);
// //              res.json({name : 'Divyansh'});
// //         });
// // };


exports.createPost = (req,res,next) => {
    const userId = req.body.userId;
    const content = req.body.content;
    User.findByPk(userId)
        .then(user => {
            return user.createPost({
                content : content,
            });
        })
        .then(() => {
            res.status(200).json({message : 'Post created successfully'});
        })
        .catch(err => {
            console.log(err);
        });
};


exports.fetchDiscussionPost = (req,res,next) => {
    const postId = req.params.postId;
    let users = [];
    let postInfo = {};
    User.findAll()
        .then(fetchedUsers => {
            users = fetchedUsers;
            return Post.findByPk(postId)
        })
        .then(post => {
            console.log('post',post);
            const author = users.find(u => u.id === post.userId);
            postInfo.postId = post.id;
            postInfo.content = post.content;
            postInfo.userId = post.userId;
            postInfo.name = author.name;
            return Comment.findAll({where : {postId : postId}});
        })
        .then(comments => {
            console.log('comments',comments);
            let postComments = [];
            comments.forEach(comment => {
                console.log('comment',comment);
                const singleComment = {};
                const author = users.find(u => u.id === comment.userId);
                singleComment.name = author.name;
                singleComment.userId = author.id;
                singleComment.commentId = comment.id;
                singleComment.content = comment.content;
                postComments.push(singleComment);
            });
            postInfo.comments = postComments;
            res.json(postInfo);
        });
};

