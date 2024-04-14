const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Watch = sequelize.define(
  "Watch",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    caseSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    caseWidth: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    movement: {
      type: DataTypes.ENUM(
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
      type: DataTypes.ENUM("new", "semi-used", "used", "worn"),
      defaultValue: "new",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    images: {
      type: DataTypes.TEXT, // O DataTypes.JSON si tu base de datos lo soporta y necesitas más estructura
      allowNull: false,
    },
    brandID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Brands",
        key: "id",
      },
    },
    userID: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
    },
    purchaseDate: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "Watches",
  }
);
//? AUNQUE NO ESTÉ AQUI EN PHPMYADMIN SI QUE HEMOS AÑADIDO EL createdAt y el updatedAt
//? si lo hubiesemos hecho mediante aqui tendríamos que haber modificado el modelo y la migración
//? por 48384589 vez :D
Watch.associate = function (models) {
  Watch.belongsTo(models.Brand, {
    foreignKey: "brandID",
    as: "brand",
  });
  Watch.belongsTo(models.User, {
    foreignKey: "userID",
    as: "user",
  });
};

module.exports = Watch;
