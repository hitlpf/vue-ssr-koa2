const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const path = require('path');
const fs = require('fs');
const { createBundleRenderer } = require('vue-server-renderer');
const backendApp = new Koa();
const frontendApp = new Koa();
const backendRouter = new Router();
const frontendRouter = new Router();

const csrRouter = require('../src/router/csrRouter');

const serverBundle = require(path.resolve(__dirname, '../dist/vue-ssr-server-bundle.json'));
const clientManifest = require(path.resolve(__dirname, '../dist/vue-ssr-client-manifest.json'));
const template = fs.readFileSync(path.resolve(__dirname, '../dist/index.ssr.html'), 'utf-8');

const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false,
  template: template,
  clientManifest: clientManifest
});


// 后端Server
backendApp.use(serve(path.resolve(__dirname, '../dist')));

// 不管直接输入http://localhost:3000还是http://localhost:4000，两个服务默认的跟路由都是渲染dist下面的index.html

backendRouter.get('*', async (ctx, next) => {
  console.log('ctx', ctx);
  console.log('url', ctx.url);

  let context = {
    url: ctx.url
  };

  // api 拦截器
  let pattern = /^\/(?:\.dist|favicon\.ico)/gi;
  if (pattern.test(ctx.url)) {
      // await next();
      return false;
  }

  // const ssrStream = renderer.renderToStream(context);
  const html = await renderer.renderToString(context)
  ctx.status = 200;
  ctx.type = 'html';
  // ctx.body = ssrStream;
  ctx.body = html;
});

backendApp.use(backendRouter.routes()).use(backendRouter.allowedMethods());

backendApp.listen(4000, () => {
  console.log('服务器端渲染地址： http://localhost:4000');
});

// 前端Server
frontendApp.use(serve(path.resolve(__dirname, '../dist')));

// frontendRouter.get(/\/index|\/foo|\/bar/, (ctx, next) => {
//   let html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8');
//   ctx.type = 'html';
//   ctx.status = 200;
//   ctx.body = html;
// });

frontendApp.use(frontendRouter.routes()).use(frontendRouter.allowedMethods());

csrRouter.init(frontendRouter);

frontendApp.listen(3000, () => {
  console.log('浏览器端渲染地址： http://localhost:3000');
});