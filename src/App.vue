/**
 * @Author: 马雄伟 maxiongwei@vchangyi.com
 * @Date: 2022-08-16 15:08:45
 * @LastEditors: 马雄伟 maxiongwei@vchangyi.com
 * @LastEditTime: 2023-09-14 15:12:16
 * @FilePath: /vr-demo/src/App.vue
 * @description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
<script setup lang="ts">
import { ref } from '@vue/reactivity'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
const store = useStore()
const router = useRouter()
let currentPath = ref(store.state.currentPath);
console.log(currentPath);
const goPage = (name:string) => {
  router.push({ path: `/${name}` })
  currentPath.value = "/" + name;
}
</script>

<template>
  <div class="nav" v-if="currentPath === '/'">
    <div class="nav-item" @click="goPage('house')">VR 看房</div>
    <div class="nav-item" @click="goPage('isle')">3D 小岛</div>
    <div class="nav-item" @click="goPage('surround')">地月环绕</div>
    <div class="nav-item" @click="goPage('missile')">3D导弹飞行演示</div>
    <div class="nav-item" @click="goPage('fitting-room')">试衣间</div>
    <div class="nav-item" @click="goPage('tlp')">模版</div>

  </div>
  <router-view></router-view>
</template>

<style scoped>
.nav {
  display: flex;
  position: fixed;
  width: 100%;
  z-index: 1;
}
.nav-item{
  flex: 1;
  height: 50px;
  line-height: 50px;
  background: rgba(0,0,0,0.7);
  padding:0 20px;
  color: #FFFFFF;
}
</style>
