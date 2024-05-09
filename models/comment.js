const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Comment = sequelize.define("Comment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users", // Nombre de la tabla tal como se definió
      key: "id",
    },
  },
  articleID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Articles", // Nombre de la tabla tal como se definió
      key: "id",
    },
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
},{
  timestamps: true,
}
);

Comment.associate = function (models) {
  Comment.belongsTo(models.User, {
    foreignKey: "userID",
    as: "user",
  });
  Comment.belongsTo(models.Article, {
    foreignKey: "articleID",
    as: "article",
  });
};

module.exports = Comment;
