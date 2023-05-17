const router = require('koa-router')();
const { UserManager, USER_CODE } = require('../controller/user');
const { AuthenticateManager } = require('../controller/auth');
router.prefix('/users');

const userManager = new UserManager();

router.get('/register', async function (ctx, next) {
  const { name, phone, password } = ctx.request.query;
  const resultCode = await userManager.register(phone, name, password);
  switch (resultCode) {
    case USER_CODE.REGISTER_SUC:
      ctx.body = {
        success: true,
        msg: 'register success',
      };
      break;
    default:
      ctx.body = {
        success: false,
        msg: 'register fail',
      };
      break;
  }
});

router.get('/login', async function (ctx, next) {
  const { phone, password } = ctx.request.query;
  const { code: resultCode, data } = await userManager.login(phone, password);
  switch (resultCode) {
    case USER_CODE.LOGIN_SUC:
      const token = AuthenticateManager.createToken(phone, password, data.id, data.name);
      ctx.body = {
        success: true,
        msg: 'login success',
        token,
      };
      break;
    case USER_CODE.NO_USER:
      ctx.body = {
        success: false,
        msg: 'account have no register',
      };
      break;
    case USER_CODE.PASSWORD_MATCH_FAIL:
      ctx.body = {
        success: false,
        msg: 'error password',
      };
      break;
    default:
      ctx.body = {
        success: false,
        msg: 'login fail',
      };
      break;
  }
});

router.get('/edit', async function (ctx, next) {
  const { name, password } = ctx.request.query;
  const token = ctx.request.headers.token;
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
  const originPhone = decoded.phone;
  const resultCode = await userManager.edit(originPhone, name, password);
  switch (resultCode) {
    case USER_CODE.EDIT_SUC:
      ctx.body = {
        success: true,
        msg: 'edit success',
      };
      break;
    default:
      ctx.body = {
        success: false,
        msg: 'edit fail',
      };
      break;
  }
});
module.exports = router;
