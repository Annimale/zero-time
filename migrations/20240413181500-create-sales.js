"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Sales", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      status: {
        allowNull:false,
        type: Sequelize.ENUM("in-review","approved","declined"),
        defaultValue:"in-review",
      },
      userID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      ref: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      brandID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Brands",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      model: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      caseSize: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      condition: {
        allowNull: false,
        type: Sequelize.ENUM("new", "semi-used", "used", "worn"),
        defaultValue: "new",
      },
      box: {
        type: Sequelize.BOOLEAN,
      },
      papers: {
        type: Sequelize.BOOLEAN,
      },
      images: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      yearOfPurchase: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Sales");
  },
};
