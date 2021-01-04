const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Upvoter = sequelize.define('upvoter',{
    id : {
        type : Sequelize.STRING,
        allowNull : false,
        primaryKey : true,
    }
});

module.exports = Upvoter;