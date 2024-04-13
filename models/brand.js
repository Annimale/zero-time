module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define('Brand', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'Brands'
  });

  Brand.associate = function(models) {
    Brand.hasMany(models.Watch, {
      foreignKey: 'brandID',
      as: 'watches'
    });
  };

  return Brand;
};
