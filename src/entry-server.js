import { createApp } from './app.js';

export default context => {
  // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
  // 以便服务器能够等待所有的内容在渲染前，就已经准备就绪。
  return new Promise((resolve, reject) => {
    const { app, store, router, App } = createApp();

    // 向 history 栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，则回到之前的 URL
    router.push(context.url);
    // 等到 router 将可能的异步组件和钩子函数解析完
    router.onReady(() => {
      // 获取当前url下的组件
      const matchedComponents = router.getMatchedComponents();
      // 判断当前路径下是否有组件, 匹配不到的路由，执行 reject 函数，并返回 404
      if (!matchedComponents.length) {
        return reject({ code: 404 });
        // return resolve(app); // 这样会直接返回首页内容
      }
      // 对所有匹配的路由组件调用 asyncData
      // Promise.all([p1,p2,p3])
      Promise.all(matchedComponents.map(component => {
        if (component.asyncData) {
          return component.asyncData({ store });
        }
      })).then(() => {
        // 当使用 template 时，context.state 将作为 window.__INITIAL_STATE__ 状态，自动嵌入到最终的 HTML 中
        // 将服务端获取到的数据挂载到context对象上
        context.state = store.state;
        console.log(store.state);
        // 返回根组件
        resolve(app);
      });
    }, reject);
  });
}