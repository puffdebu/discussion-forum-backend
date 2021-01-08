const Sequelize = require('sequelize');
const sequelize = require('../utils/database');


const Action = sequelize.define('action',{
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true,
    },
    upvoted : Sequelize.BOOLEAN,
    downvoted : Sequelize.BOOLEAN,
});


module.exports = Action;