const express = require('express');
const router = express.Router();
const postController = require('../controllers/posts');

router.post('/create-post',postController.createPost); 

router.get('/fetch-posts',postController.fetchUserPosts);

router.get('/fetch-discussion-post/:postId/:userId',postController.fetchDiscussionPost);

router.post('/add-comment',postController.postComment);

router.get('/search-query/:keyword',postController.searchKeyWord);

router.post('/upvote',postController.upvoteHandler);

router.post('/downvote',postController.downVoteHandler);

module.exports = router;