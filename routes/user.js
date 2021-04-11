const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/signup',userController.signUpHandler); // Initializing user in db while signing up.

router.post('/login',userController.loginHandler); // response json with userId and name 

module.exports = router;