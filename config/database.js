const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('zero-time', 'root', '', {
  host: 'localhost',
  dialect: 'mysql' // o el dialecto de tu base de datos
});

module.exports = sequelize;