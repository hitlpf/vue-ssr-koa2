import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const fetchBar = function() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(111111);
      resolve('bar 组件返回 ajax 数据');
    }, 1000);
  });
};

function createStore() {
  const store = new Vuex.Store({
    state: {
      bar: '',
      foo: ''
    },

    mutations: {
      'SET_BAR'(state, data) {
        state.bar = data;
      },
      'SET_FOO'(state, data) {
        state.foo = data;
      }
    },

    actions: {
      fetchBar({ commit }) {
        return fetchBar().then((data) => {
          commit('SET_BAR', data);
          commit('SET_FOO', data);
        }).catch((err) => {
          console.error(err);
        })
      }
    }
  });
  // 这句的作用是如果服务端的vuex数据发生改变，就将客户端的数据替换掉，保证客户端和服务端的数据同步
  if (typeof window !== 'undefined' && window.__INITIAL_STATE__) {
    console.log('window.__INITIAL_STATE__', window.__INITIAL_STATE__);
    store.replaceState(window.__INITIAL_STATE__);
  } else {
    console.log('no browser');
  }
  
  return store;
}

export default createStore;