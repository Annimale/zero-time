const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

    const Article = sequelize.define('Article', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        subtitle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        coverImage: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        secondaryImage: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        category: {
            type: DataTypes.ENUM("in-depth","hands-on","introducing","one-to-watch"),
            defaultValue:"in-depth",
        }
    }, {
        tableName: 'Articles'
    });
    //? AUNQUE NO ESTÉ AQUI EN PHPMYADMIN SI QUE HEMOS AÑADIDO EL createdAt y el updatedAt
    //? si lo hubiesemos hecho mediante aqui tendríamos que haber modificado el modelo y la migración
    //? por 48384589 vez :D 
    Article.associate = function(models) {
        Article.hasMany(models.Comment, {
            foreignKey: 'articleID',
            as: 'comments'
        });
    };

    module.exports = Article;

