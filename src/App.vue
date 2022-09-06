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
