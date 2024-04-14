'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
      id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
      },
      userID: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
              model: 'Users', // Asegúrate de que esto coincida con el nombre real de la tabla
              key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
      },
      articleID: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
              model: 'Articles', // Asegúrate de que esto coincida con el nombre real de la tabla
              key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
      },
      body: {
          type: Sequelize.TEXT,
          allowNull: false
      }
  });
},

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Comments');
  }
};
