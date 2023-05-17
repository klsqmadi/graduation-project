const router = require('koa-router')();
const { AuthenticateManager } = require('../controller/auth');
const { TableManager, TABLE_CODE } = require('../controller/table');
const { Table } = require('../utils/sequelize');
router.prefix('/table');

router.get('/create', async function (ctx, next) {
  const token = ctx.request.headers.token;
  if (!token) {
    ctx.body = {
      success: false,
      msg: 'no token',
    };
  }
  const decoded = AuthenticateManager.authToken(token);
  if (!decoded) {
    ctx.body = {
      success: false,
      msg: 'invalid token',
    };
    return;
  }

  const { phone, password, id } = decoded;
  console.log('decoded', decoded);
  const { code, data } = await TableManager.createTable(id);
  switch (code) {
    case TABLE_CODE.CREATE_SUC:
      ctx.body = {
        success: true,
        data,
      };
      break;
    default:
      ctx.body = {
        success: false,
        msg: 'create fail',
      };
      break;
  }
});
router.get('/getList', async function (ctx, next) {
  const { token } = ctx.request.headers;
  if (!token) {
    ctx.body = {
      success: false,
      msg: 'no token',
    };
    return;
  }

  const decoded = AuthenticateManager.authToken(token);
  if (!decoded) {
    ctx.body = {
      success: false,
      msg: 'invalid token',
    };
    return;
  }
  const { id } = decoded;
  const { code, data } = TableManager.getTableList(id);
  switch(code) {
    case TABLE_CODE.GET_TABLE_LIST_SUC:
      ctx.body = {
        success: true,
        msg: 'get table list success',
        data,
      };
      break;
    default:
      ctx.body = {
        success: false,
        msg: 'get table list fail',
      }
  }
});
module.exports = router;
