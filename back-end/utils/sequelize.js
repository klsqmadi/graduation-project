const { Sequelize } = require('sequelize');

const config = {
  host: 'localhost',
  username: 'root',
  password: '',
  database: 'graduation-design',
  port: 3306,
  dialect: 'mysql',
  timezone: '+08:00',
};

const sequelize = new Sequelize(config);
exports.sequelize = sequelize;
sequelize
  .authenticate()
  .then(() => {
    console.log(`connect mysql: ${config.database} success`);
  })
  .catch((err) => [console.log(`connect mysql error ${err}`)]);

(async () => {
  await sequelize.sync({ force: false });
  const { User } = require('../model/User');
  const { Table } = require('../model/Table');
  module.exports = {
    User,
    Table,
  };

  console.log(`databse table model force sync cover success`);
})();
