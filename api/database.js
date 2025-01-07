import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('postgres://postgres:sofia2376@localhost:5432/devlabs', {
  logging: false, // Desactiva los logs
});
// Función para autenticar la conexión
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await sequelize.sync({ force: false }); // Sincroniza los modelos (force: true elimina y recrea las tablas)
    console.log("Los modelos fueron sincronizados correctamente.");

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// Exportar la instancia para usarla en otros archivos
export default sequelize;