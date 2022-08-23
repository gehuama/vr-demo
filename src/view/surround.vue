<script setup lang="ts">
import * as THREE from "three";
// 导入轨道控制器 旋转看整个空间效果
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
// 2d渲染器 2d 对象
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer"
import { onMounted, ref } from "vue";

import { useRoute } from 'vue-router'
const route = useRoute()
console.log(route.path)

const container = ref();

//  声明全局变量
let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, labelRenderer: CSS2DRenderer;
let moon: THREE.Object3D<THREE.Event> | THREE.Mesh<THREE.SphereGeometry, THREE.MeshPhongMaterial>, earth: THREE.Object3D<THREE.Event> | THREE.Mesh<THREE.SphereGeometry, THREE.MeshPhongMaterial>;
let clock = new THREE.Clock();
// 实例化纹理加载器
const textureLoader = new THREE.TextureLoader();
// 地球和月球半径大小
const EARTH_RADIUS = 2.5;
const MOON_RADIUS = 0.27;
function init() {
  // 实例化相机
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(10, 5, 20);
  // 实例化场景
  scene = new THREE.Scene();
  // 创建聚光灯光源创建 添加
  const dirLight = new THREE.SpotLight(0xFFFFFF);
  dirLight.position.set(0, 0, 10);
  // 光源强度
  dirLight.intensity = 2;
  // 灯光投射出阴影出来
  dirLight.castShadow = true;
  scene.add(dirLight)
  // 添加环境光
  const aLight = new THREE.AmbientLight(0xFFFFFF);
  aLight.intensity = 0.3;
  scene.add(aLight)


  // 创建月球
  const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, 16, 16);
  // 材质 高光材质
  const moonMaterial = new THREE.MeshPhongMaterial({
    map: textureLoader.load("./imgs/surround/textures/planets/moon_1024.jpg")
  });
  moon = new THREE.Mesh(moonGeometry, moonMaterial)
  // 阴影 地球接收阴影
  moon.receiveShadow = true;
  moon.castShadow = true;
  scene.add(moon);

  // 创建地球
  const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 16, 16)
  // 材质 高光材质
  const earthMaterial = new THREE.MeshPhongMaterial({
    shininess: 5,
    map: textureLoader.load("./imgs/surround/textures/planets/earth_atmos_2048.jpg"),
    specularMap: textureLoader.load("./imgs/surround/textures/planets/earth_specular_2048.jpg"),
    normalMap: textureLoader.load("./imgs/surround/textures/planets/earth_normal_2048.jpg")
  });
  earth = new THREE.Mesh(earthGeometry, earthMaterial)
  // 阴影 地球接收阴影
  earth.receiveShadow = true;
  earth.castShadow = true;
  scene.add(earth);

  const earthDiv = document.createElement("div");
  earthDiv.className = "label";
  earthDiv.textContent = "地球";
  const earthLabel = new CSS2DObject(earthDiv);
  earthLabel.position.set(0, EARTH_RADIUS + 0.5, 0);
  earth.add(earthLabel);

  const moonDiv = document.createElement("div");
  moonDiv.className = "label";
  moonDiv.textContent = "月球";
  const moonLabel = new CSS2DObject(moonDiv);
  moonLabel.position.set(0, MOON_RADIUS + 0.5, 0);
  moon.add(moonLabel);

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({
    alpha: true
  });
  // 设置像素比
  renderer.setPixelRatio(window.innerWidth / window.innerWidth);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  // 标签渲染器
  labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0px";
  
  // 添加控制器
  const controls = new OrbitControls(camera, container.value);
  controls.enableDamping = true; // 动态阻尼系数 就是鼠标拖拽旋转灵敏度
  container.value.appendChild(renderer.domElement);
  container.value.appendChild(labelRenderer.domElement);
}
let oldTime = 0;
function animate() {
  const elapsed = clock.getElapsedTime();
  moon.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5);

  // 地球自转
  var axis = new THREE.Vector3(0, 1, 0);
  earth.rotateOnAxis(axis, (elapsed - oldTime) * Math.PI / 10);
  renderer.render(scene, camera)
  labelRenderer.render(scene, camera)
  oldTime = elapsed
  requestAnimationFrame(animate);
}
// 调整尺寸
window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
// 挂在完毕之后获取dom
onMounted(() => {
  init()
  animate()
});
</script>

<template>
  <div class="container" ref="container">
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.container {
  background-color: #f0f0f0;
}


</style>
