const router = require('koa-router')();
const { AuthenticateManager } = require('../controller/auth');
const { TableManager, TABLE_CODE } = require('../controller/table');
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
  const { name } = ctx.request.query;
  const { id } = decoded;
  console.log('decoded', decoded);
  const { code, data } = await TableManager.createTable(id, name);
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
  const { code, data } = await TableManager.getTableList(id);
  switch (code) {
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
      };
      break;
  }
});
router.get('/delete', async function (ctx, next) {
  const { token } = ctx.request.headers;
  if (!token) {
    ctx.body = {
      success: false,
      msg: 'invalid token',
    };
    return;
  }
  const { gridKey } = ctx.request.query;
  const { code } = await TableManager.deleteTable(gridKey);
  switch (code) {
    case TABLE_CODE.DELETE_TABLE_SUC:
      ctx.body = {
        success: true,
        msg: 'delete table success',
      };
      break;
    default: 
      ctx.body = {
        success: true,
        msg: 'delete table fail',
      };
      break;
  } 
});
router.post('/load', async function (ctx, next) {
  const { gridKey } = ctx.request.query;
  const { code, data } = await TableManager.loadTable(gridKey);
  switch (code) {
    case TABLE_CODE.LOAD_TABLE_SUC:
      ctx.body = data;
      break;
    default:
      ctx.body = {
        success: false, 
      }
  }
});
module.exports = router;
