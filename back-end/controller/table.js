const { Table, Sheet } = require('../model/Table');
const TABLE_CODE = {
  CREATE_SUC: 1,
  CREATE_FAIL: 2,
  GET_TABLE_LIST_SUC: 3,
  GET_TABLE_LIST_FAIL: 4,
};
class TableManager {
  static newTableName = '新建表格';
  static async createTable(userId) {
    try {
      const newTable = await Table.create({
        userId,
        name: TableManager.newTableName,
      });
      const { gridKey, name } = newTable;
      await Sheet.create({
        gridKey,
        blockDataJson: new InitializeTable(
          TableManager.newTableName,
          'zh',
          gridKey
        ).serialize(),
        bloackIndex: 1,
      });
      return {
        code: TABLE_CODE.CREATE_SUC,
        data: {
          name,
          userId,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        code: TABLE_CODE.CREATE_FAIL,
        data: null,
      };
    }
  }
  static async openTable(gridKey) {}
  static async getTableList(userId) {
    try {
      const tablelist = await Table.findAll({ where: userId });
      return {
        code: TABLE_CODE.GET_TABLE_LIST_SUC,
        data: tablelist,
      };
    } catch (error) {
      console.log(error);
      return {
        code: TABLE_CODE.GET_TABLE_LIST_FAIL,
        data: null,
      };
    }
  }
}
class InitializeTable {
  constructor(title, lang, gridKey) {
    this.title = title;
    this.lang = lang;
    this.gridKey = gridKey;
    this.data = [
      {
        name: 'Sheet1',
        color: '',
        index: 1,
        status: 1,
        order: 1,
        row: 10,
        column: 5,
        celldata: [],
        config: {},
      },
    ];
  }
  serialize() {
    const keys = Object.keys();
    const obj = {};
    for (const key in keys) {
      if (Object.hasOwnProperty.call(keys, key)) {
        obj[key] = this[key];
      }
    }
    return JSON.stringify(obj);
  }
}
module.exports = {
  TableManager,
  TABLE_CODE,
};
