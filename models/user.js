const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  // Define los atributos del modelo
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Esto hará que se genere automáticamente el ID
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  verificationToken: {
    type: DataTypes.STRING,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  role: {
    type: DataTypes.ENUM("admin", "user"),
    defaultValue: "user", // Valor por defecto es 'user'
  },
});
//? AUNQUE NO ESTÉ AQUI EN PHPMYADMIN SI QUE HEMOS AÑADIDO EL createdAt y el updatedAt
//? si lo hubiesemos hecho mediante aqui tendríamos que haber modificado el modelo y la migración
//? por 48384589 vez :D

User.associate = function (models) {
  User.hasMany(models.Watch, {
    foreignKey: "userID",
    as: "watches",
  });
  User.hasMany(models.Sale, {
    foreignKey: "userID",
    as: "sales",
  });
  User.hasMany(models.Comment, {
    foreignKey: "userID",
    as: "comments",
  });
};

module.exports = User;
