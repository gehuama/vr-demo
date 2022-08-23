import { createStore } from 'vuex'

// 创建一个新的 store 实例
const store = createStore({
  state () {
    return {
      currentPath: "/"
    }
  },
  mutations: {
    increment (state,path) {
      state.currentPath = path
    }
  }
})
export {store};