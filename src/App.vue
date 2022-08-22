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
  <div v-if="currentPath === '/'" class="container">
    <div @click="goPage('house')">VR 看房</div>
    <div @click="goPage('isle')">3D 小岛</div>
  </div>
  <router-view></router-view>
</template>

<style scoped>
.container {
  background: #ffffff;
}
</style>
