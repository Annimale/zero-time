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
},{
  timestamps: true,
});


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
