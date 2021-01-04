const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const User = sequelize.define('user',{
    id : {
        type : Sequelize.STRING,
        allowNull : false,
        primaryKey : true,
    },
    name : Sequelize.STRING,
});

module.exports = User;

