const Sequelize = require('sequelize');

const sequelize = new Sequelize('discussion-forum-test1','root','srkmyidol',{
    dialect : 'mysql',
    host : 'localhost',
});

module.exports = sequelize;