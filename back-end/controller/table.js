const { Table, Sheet } = require('../model/Table');
const TABLE_CODE = {
  CREATE_SUC: 1,
  CREATE_FAIL: 2,
  GET_TABLE_LIST_SUC: 3,
  GET_TABLE_LIST_FAIL: 4,
  DELETE_TABLE_SUC: 5,
  DELETE_TABLE_FAIL: 6,
  LOAD_TABLE_SUC: 7,
  LOAD_TABLE_FAIL: 8,
};
class TableManager {
  static newTableName = '新建表格';
  static async createTable(userId, name = TableManager.newTableName) {
    try {
      const newTable = await Table.create({
        userId,
        name,
      });
      const { gridKey } = newTable;
      await Sheet.create({
        gridKey,
        blockDataJson: (new InitializeTable(
          'zh',
          gridKey
        )).serialize(),
        bloackIndex: 1,
        name,
      });
      return {
        code: TABLE_CODE.CREATE_SUC,
        data: newTable,
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
      const tablelist = await Table.findAll({ where: { userId } });
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
  static async deleteTable(gridKey) {
    try {
      console.log(111111111);
      await Table.destroy({ where: { gridKey } });
      await Sheet.destroy({ where: { gridKey } });
      return {
        code: TABLE_CODE.DELETE_TABLE_SUC,
      };
    } catch (error) {
      console.log(error);
      return {
        code: TABLE_CODE.DELETE_TABLE_FAIL,
      };
    }
  }
  static async loadTable(gridKey) {
    try {
      const sheet = await Sheet.findOne({ where: { gridKey } });
      const { blockDataJson } = sheet;
      const { data } = JSON.parse(blockDataJson);
      return {
        code: TABLE_CODE.LOAD_TABLE_SUC,
        data: JSON.stringify(data),
      }
    } catch (error) {
      console.log(error);
      return {
        code: TABLE_CODE.LOAD_TABLE_FAIL,
        data: null,
      }
    }
  }
  static async updateValue(gridKey, jsonData) {
    try {
      const sheet = await Sheet.findOne({ where: { gridKey } });
      const blockDataJson = JSON.parse(sheet.blockDataJson);
      const { data } = blockDataJson;
      const { i: name, v, r, c } = jsonData;
      const findData = data.find(i => i.index === name);
      if (!findData) return;
      const { celldata } = findData;
      const findRowAndCol = celldata.findIndex(i => i.r === r && i.c === c);
      console.log('v', v);
      if (findRowAndCol === -1) {
        celldata.push({"r":r,"c":c,v});
      } else {
        celldata[findRowAndCol] = {"r":r,"c":c,v};
      }
      console.log('save data', data);
      sheet.update({
        blockDataJson: JSON.stringify(blockDataJson)
      });
    } catch (error) {
      console.log(error);
    }
  }
  static async addRowColumn(gridKey, jsonData) {
    try {
      const sheet = await Sheet.findOne({ where: { gridKey } });
      const blockDataJson = JSON.parse(sheet.blockDataJson);
      const { data } = blockDataJson;
      console.log('addRowCol before', JSON.stringify(data));
      const { i: name, v: { index, len }, rc } = jsonData;
      const findData = data.find(i => i.index === name);
      if (!findData) return;
      const { celldata } = findData;
      if (rc === 'r') {
        findData.row += len;
        celldata.forEach((item, itemIndex) => {
          const r = Number(item.r);
          if (r < index) return;
          celldata[itemIndex].r = r + len;
        })
      } else if (rc === 'c') {
        findData.column += len;
        celldata.forEach((item, itemIndex) => {
          const c = Number(item.c);
          if (c < index) return;
          celldata[itemIndex].c = c + len;
        })
      }
      console.log('addRowCol data after', JSON.stringify(data));
      sheet.update({
        blockDataJson: JSON.stringify(blockDataJson),
      })
    } catch (error) {
      console.log(error);
    }
  }
  static async deleteRowColumn(gridKey, jsonData) {
    try {
      const sheet = await Sheet.findOne({ where: { gridKey } });
      const blockDataJson = JSON.parse(sheet.blockDataJson);
      const { data } = blockDataJson;
      console.log('deleteRowCol before', JSON.stringify(data));
      const { i: name, v: { index, len }, rc } = jsonData;
      const findData = data.find(i => i.index === name);
      if (!findData) return;
      const { celldata } = findData;
      if (rc === 'r') {
        findData.row -= len;
        celldata.forEach((item, itemIndex) => {
          const r = Number(item.r);
          if (r < index) return;
          celldata[itemIndex].r = r - len;
        })
      } else if (rc === 'c') {
        findData.column -= len;
        celldata.forEach((item, itemIndex) => {
          const c = Number(item.c);
          if (c < index) return;
          celldata[itemIndex].c = c - len;
        })
      }
      console.log('deleteRowCol data after', JSON.stringify(data));
      sheet.update({
        blockDataJson: JSON.stringify(blockDataJson),
      })
    } catch (error) {
      console.log(error);
    }
  }
  static async addSheet(gridKey, jsonData) {
    try {
      const sheet = await Sheet.findOne({ where: { gridKey } });
      const blockDataJson = JSON.parse(sheet.blockDataJson);
      const { data } = blockDataJson;
      const { v } = jsonData;
      data.push(v);
      console.log('addSheet', JSON.stringify(data));
      sheet.update({
        blockDataJson: JSON.stringify(blockDataJson),
      })
    } catch (error) {
      console.log(error);
    }
  }
  static async deleteSheet(gridKey, jsonData) {
    try {
      const sheet = await Sheet.findOne({ where: { gridKey } });
      const blockDataJson = JSON.parse(sheet.blockDataJson);
      const { data } = blockDataJson;
      const { v: { deleteIndex } } = jsonData;
      const deleteSheetIndex = data.findIndex(i => i.index === deleteIndex);
      if (deleteSheetIndex === -1) return;
      data.splice(deleteIndex, 1);
      sheet.update({
        blockDataJson: JSON.stringify(blockDataJson),
      })
    } catch (error) {
      console.log(error);
    }
  }
  static async renameSheet(gridKey, jsonData) {
    try {
      const sheet = await Sheet.findOne({ where: { gridKey } });
      const blockDataJson = JSON.parse(sheet.blockDataJson);
      const { data } = blockDataJson;
      console.log(`before rename sheet`, JSON.stringify(data), '-----------\n');
      const { i: name, v } = jsonData; 
      const findSheet = data.find(i => i.index === name);
      if (!findSheet) return;
      findSheet.name = v;
      sheet.update({
        blockDataJson: JSON.stringify(blockDataJson),
      });
      console.log('after rename sheet', JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  }
}
class InitializeTable {
  constructor(lang, gridKey) {
    this.lang = lang;
    this.gridKey = gridKey;
    this.data =  [	
      {
        "name": "Sheet1",
        "index": "Sheet1",
        "order":  0,
        "status": 1,
        "column": 18,
        "row": 36,
        "celldata": [{"r":0,"c":0,"v":{"v":1,"m":"1","ct":{"fa":"General","t":"n"}}}]
      },
    ];
  }
  serialize() {
    const keys = Object.keys(this);
    console.log(keys);
    const obj = {};
    for (const key of keys) {
      obj[key] = this[key];
    }
    console.log(obj);
    return JSON.stringify(obj);
  }
}
module.exports = {
  TableManager,
  TABLE_CODE,
};
