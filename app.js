// Third party libraries
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


// Models,routes,db connection Imports // 
const sequelize = require('./utils/database');
const User  = require('./models/user');
const Post = require('./models/post');
// const Comment = require('./models/comment');
// const Upvoter = require('./models/upvoter');
// const Action = require('./models/action');


const postRoutes = require('./routes/posts');
const userRoutes= require('./routes/user');

// Creating App 
const app = express();

// Middlewares
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers','content-type');
    next();
});

app.use(userRoutes);
app.use(postRoutes);

mongoose.connect('mongodb+srv://nishee:nishee@cluster0.f3dfq.mongodb.net/forum?retryWrites=true&w=majority')
.then(result =>{
    app.listen(8080);
})
.catch(err =>{
    console.log(err);
})


