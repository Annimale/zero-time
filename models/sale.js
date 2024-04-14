const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Sale = sequelize.define(
  "Sale",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // Nombre de la tabla tal y como fue definida en Sequelize
        key: "id",
      },
    },
    ref: {
      type: DataTypes.STRING,
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
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    caseSize: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    condition: {
      type: DataTypes.ENUM("new", "semi-used", "used", "worn"),
      defaultValue: "new",
    },
    box: {
      type: DataTypes.BOOLEAN,
    },
    papers: {
      type: DataTypes.BOOLEAN,
    },
    images: {
      type: DataTypes.TEXT, // Puede ser TEXT si espera almacenar URLs o JSON si son varias imágenes
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    yearOfPurchase: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    watchID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Watches",
        key: "id",
      },
    },
  },
  {
    tableName: "Sales",
  }
);
//? AUNQUE NO ESTÉ AQUI EN PHPMYADMIN SI QUE HEMOS AÑADIDO EL createdAt y el updatedAt
//? si lo hubiesemos hecho mediante aqui tendríamos que haber modificado el modelo y la migración
//? por 48384589 vez :D
Sale.associate = function (models) {
  Sale.belongsTo(models.User, {
    foreignKey: "userID",
    as: "user",
  });
  Sale.belongsTo(models.Brand, {
    foreignKey: "brandID",
    as: "brand",
  });
  Sale.belongsTo(models.Watch, {
    foreignKey: "watchID",
    as: "watch",
  });
};

module.exports = Sale;
