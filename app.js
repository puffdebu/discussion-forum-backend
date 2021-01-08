// Third party libraries
const express = require('express');
const bodyParser = require('body-parser');

// Models,routes,db connection Imports // 
const sequelize = require('./utils/database');
const User  = require('./models/user');
const Post = require('./models/post');
const Comment = require('./models/comment');
const Upvoter = require('./models/upvoter');
const Action = require('./models/action');

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


// Associations 
// Post and User
Post.belongsTo(User, {
    constraints : true,
    onDelete : 'CASCADE',
});

User.hasMany(Post);

//Comment and User and Post
Comment.belongsTo(User,{
    constraints : true,
    onDelete : 'CASCADE',
});

User.hasMany(Comment);

Comment.belongsTo(Post, {
    constraints : true,
    onDelete : 'CASCADE',
});

Post.hasMany(Comment);

// Upvoter and Comment

Comment.belongsToMany(Upvoter, {through : Action});
Upvoter.belongsToMany(Comment,{through : Action});

sequelize
    //.sync({force : true})
    .sync()
    .then(() => {
        app.listen(8080);
    })
    .catch(err => {
        console.log(err);
    })
