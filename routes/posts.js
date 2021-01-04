const express = require('express');
const router = express.Router();
const postController = require('../controllers/posts');

// router.get('/',postController.fetchPosts);

// router.get('/add-post/:userId',postController.addPost);

// router.post('/postPost/:userId',postController.postPost);

// router.get('/add-comment/:userId/:postId',postController.addComment);

// router.get('/comment',postController.comment);

// router.post('/comment',postController.postComment);

// router.get('/check-for-user/:userId',postController.checkForUser);


router.post('/create-post',postController.createPost); 

router.get('/fetch-posts',postController.fetchUserPosts);

router.get('/fetch-discussion-post/:postId',postController.fetchDiscussionPost);

module.exports = router;