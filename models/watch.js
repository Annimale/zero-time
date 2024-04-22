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
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    caseThickness: {
      type: DataTypes.FLOAT,
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
    price: {
      type: DataTypes.FLOAT,
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
   
  },
  {
    tableName: "Watches",
    timestamps: true,
  }
);

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

Watch.sync({ force: true })  // Esto eliminará la tabla si existe y la creará de nuevo
  .then(() => {
    console.log('La tabla para el modelo Watch ha sido (re)creada');
  })
  .catch((error) => {
    console.error('Error al sincronizar el modelo Watch:', error);
  });

module.exports = Watch;
