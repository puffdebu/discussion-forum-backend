const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/create-user',userController.createUser); // Initializing user in db while signing up.

router.get('/get-info/:userId/:userName',userController.getInfo); // response json with userId and name 

module.exports = router;