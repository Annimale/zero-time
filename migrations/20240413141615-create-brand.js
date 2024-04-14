'use strict';

const sequelize = require('../config/database');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Brands', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description:{
        allowNull:false,
        type: Sequelize.TEXT
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Brands');
  }
};
