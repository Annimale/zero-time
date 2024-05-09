const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('zero-time', 'root', '', {
  host: 'localhost',
  dialect: 'mysql' ,
  logging: console.log,

});

module.exports = sequelize;