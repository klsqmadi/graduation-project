const router = require('koa-router')();

router.prefix('/users');

router.get('/register', function (ctx, next) {
  ctx.body = 'this is a users response!';
});

router.get('/login', function (ctx, next) {
  ctx.body = 'this is a users/bar response';
});

router.get('/edit', function (ctx, next) {});
module.exports = router;
