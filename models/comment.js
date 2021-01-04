const Sequelize = require('sequelize');
const sequelize = require('../utils/database');


const Comment = sequelize.define('comment',{
    id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true,
    },
    content : Sequelize.TEXT,
    upvotes : Sequelize.INTEGER,
});

module.exports = Comment;