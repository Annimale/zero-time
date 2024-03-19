// models/brand.js
module.exports = (sequelize, DataTypes) => {
    const Brand = sequelize.define('Brand', {
      // Define tus columnas y sus tipos de datos aquí
      name: DataTypes.STRING,
    });
  
    Brand.associate = function(models) {
      // Relaciones:
      Brand.hasMany(models.Watch, { as: 'watches' });
    };
  
    return Brand;
  };
  