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
        type: Sequelize.STRING,
        allowNull: false,
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
        type: Sequelize.TEXT,
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
      watchID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Watches",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Sales");
  },
};
