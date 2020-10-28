import Vue from 'vue';
import createStore from './store/store.js';
import vueRouter from './router/vueRouter';
import App from './App.vue';

export function createApp() {

  const store = createStore();
  const router = vueRouter();
  // 当我们的代码进入该进程时，它将进行一次取值并留存在内存中。这意味着如果创建一个单例对象，它将在每个传入的请求之间共享。
  // 因此，我们不应该直接创建一个应用程序实例，而是应该暴露一个可以重复执行的工厂函数
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  });
  return { app, store, router, App };
}