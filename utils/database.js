const Sequelize = require('sequelize');

const sequelize = new Sequelize('testbackend','root','srkmyidol',{
    dialect : 'mysql',
    host : 'localhost',
});

module.exports = sequelize;