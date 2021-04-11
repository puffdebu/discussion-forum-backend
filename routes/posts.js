const express = require('express');
const router = express.Router();
const postController = require('../controllers/posts');
const checkAuth = require('../middleware/isAuth');

router.post('/create-post',checkAuth,postController.createPost); 

router.get('/fetch-posts',checkAuth,postController.fetchUserPosts);

router.get('/fetch-discussion-post/:postId',checkAuth,postController.fetchDiscussionPost);

router.post('/add-comment',checkAuth,postController.postComment);

router.post('/upvote',checkAuth,postController.upvoteHandler);

router.post('/downvote',checkAuth,postController.downVoteHandler);

router.post('/delete-post',checkAuth,postController.deletePost);

router.post('/delete-comment',checkAuth,postController.deleteComment);

module.exports = router;