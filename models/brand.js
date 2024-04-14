const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Brand = sequelize.define(
  "Brand",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "Brands",
  }
);
//? AUNQUE NO ESTÉ AQUI EN PHPMYADMIN SI QUE HEMOS AÑADIDO EL createdAt y el updatedAt
//? si lo hubiesemos hecho mediante aqui tendríamos que haber modificado el modelo y la migración
//? por 48384589 vez :D 

Brand.associate = function (models) {
  Brand.hasMany(models.Watch, {
    foreignKey: "brandID",
    as: "watches",
  });
};

module.exports = Brand;
