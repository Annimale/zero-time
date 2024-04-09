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
  role: {
    type: DataTypes.ENUM("admin", "user"),
    defaultValue: "user", // Valor por defecto es 'user'
  },
  // Continúa definiendo el resto de los campos...
});

module.exports = User;
