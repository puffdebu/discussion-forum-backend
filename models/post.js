const Sequelize = require('sequelize');
const sequelize = require('../utils/database');


const Post = sequelize.define('post',{
    id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true,
    },
    content : Sequelize.TEXT,
});

module.exports = Post;