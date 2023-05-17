const { sequelize } = require('../utils/sequelize');
const { DataTypes } = require('sequelize');
const Table = sequelize.define('tables', {
  gridKey: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
const Sheet = sequelize.define('sheets', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  gridKey: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  blockDataJson: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bloackIndex: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Sheet.belongsTo(Table, {
  foreignKey: 'gridKey',
  targetKey: 'gridKey',
});

Sheet.belongsTo(Table, {
  foreignKey: 'name',
  targetKey: 'name',
});
module.exports = {
  Table,
  Sheet,
};
