const { Sequelize, Model, DataTypes } = require('sequelize');

const config = {
  host: 'localhost',
  username: 'root',
  password: '',
  database: 'graduation-design',
  port: 3306,
  dialect: 'mysql',
};

const sequelize = new Sequelize(config);

sequelize
  .authenticate()
  .then(() => {
    console.log(`connect mysql: ${config.database} success`);
  })
  .catch((err) => [console.log(`connect mysql error ${err}`)]);

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

sequelize.sync({ force: true }).then(() => {
    console.log(`databse table model force sync cover success`);
}).catch(err => {
    console.log(`sync fail ${err}`);
});
module.export = {
    User,
    sequelize,
};
