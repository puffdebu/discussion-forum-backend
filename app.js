// Third party libraries
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');

// Models,routes,db connection Imports // 
const postRoutes = require('./routes/posts');
const userRoutes= require('./routes/user');
const eventRoutes = require('./routes/event');

// Creating App 
const app = express();


// Middlewares
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers','content-type, Authorization');
    next();
});

app.use(helmet());

app.use(userRoutes);
app.use(postRoutes);
app.use('/event',eventRoutes);

app.use((err,req,res,next) => {
    if(!err.statusCode){
        err.statusCode = 500;
    }
    res.status(err.statusCode).json({message : err.message});
})

mongoose.connect('mongodb+srv://nishee:nishee@cluster0.f3dfq.mongodb.net/forum?retryWrites=true&w=majority')
.then(result =>{
    const port = process.env.PORT || 8080;
    app.listen(port,() => {
        console.log('Server is up and running on ' + port);
    });
})
.catch(err =>{
    console.log(err);
})


