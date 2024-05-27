const { Sequelize } = require('sequelize');

// Verificar si estamos en un entorno de producción (Heroku)
if (process.env.NODE_ENV === 'production') {
  // Usar la URL de conexión de la variable de entorno DATABASE_URL
  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: console.log,
  });
} else {
  // Usar la configuración de desarrollo o prueba
  const sequelize = new Sequelize('zero-time', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: console.log,
  });
}

module.exports = sequelize;
