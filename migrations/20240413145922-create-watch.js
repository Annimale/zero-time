"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Watches", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      model: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      caseSize: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      caseWidth: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      movement: {
        allowNull: false,
        type: Sequelize.ENUM(
          "automatic",
          "quartz",
          "manual",
          "electronic",
          "spring-drive",
          "electro-mechanical"
        ),
        defaultValue: "automatic",
      },
      condition: {
        allowNull: false,
        type: Sequelize.ENUM("new", "semi-used", "used", "worn"),
        defaultValue: "new",
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      brandID: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Brands",
          key: "id",
        },
      },
      userID: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },

      purchaseDate: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Watches");
  },
};
