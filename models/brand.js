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

Brand.associate = function (models) {
  Brand.hasMany(models.Watch, {
    foreignKey: "brandID",
    as: "watches",
  });
};

module.exports = Brand;
