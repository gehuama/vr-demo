<script setup lang="ts">
// 导入three库
import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
// 导入水面
import { Water } from "three/examples/jsm/objects/Water2";
// 导入gltf载入库
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// 导入解压模型库
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
// 导入天空纹理
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
// 导入obj模型库
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
// vue3 ref 
import { onMounted, ref } from "vue";
/**
 * @description: 注册container元素
 */
const container = ref();
// 声明场景
let scene: any, camera: any, renderer: any;

/***********基础内容****************/
/**
 * @description: 创建渲染函数
 */
const render = () => {
  // 渲染
  renderer.render(scene, camera);
  // 循环渲染
  requestAnimationFrame(render);
};
/** 初始化场景 */
const init = () => {
  const scene = new THREE.Scene();
  /** 初始化相机：透视相机 */
  camera = new THREE.PerspectiveCamera(
    75, // 角度 看到景物宽广程度
    window.innerWidth / window.innerHeight, // 屏幕宽高
    0.01, // 相机看到的最小距离
    2000 // 相机看到的最大距离  
  )
  /** @description: 创建渲染器 */
  renderer = new THREE.WebGL1Renderer({ antialias: true });
  // 设置渲染器尺寸
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 设置像素比例
  renderer.setPixelRatio(window.devicePixelRatio);

  // 在场景中显示坐标轴
  const axes = new THREE.AxesHelper(100);
  // 将坐标轴添加到场景中
  scene.add(axes);

  // 设置相机位置 
  // 当模型超出画面时候，调大Z轴
  camera.position.set(1.8, 0.6, 270);
  // 
  camera.lookAt(camera.position);
  // 将相机添加到场景中
  scene.add(camera);

  /** 设置环境光光源 颜色灰色，光的强度为：0.4 默认值为1 */
  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4)
  // 将环境光光源添加到场景中
  scene.add(ambientLight);

  /** 设置点光源 */
  const pointLight = new THREE.PointLight(0xffffff, 0.8)
  // 设置点光源位置
  camera.add(pointLight)

  // /** @description: 添加平行光 */
  // const light = new THREE.DirectionalLight(0xffffff, 1);
  // light.position.set(-100, 100, 10);
  // scene.add(light);
  return scene;
};
// 初始化场景结果
scene = init();
/***********基础内容结束****************/

/***********具体相关逻辑开始**************/
// 示例 加载一个正方体
/** 创建一个长宽高为100的正方体 */
const geometry = new THREE.BoxGeometry(100, 100, 100)
/** 创建一个材质（这里使用基本的 Lambert 材质） */
const material = new THREE.MeshBasicMaterial({color: 0xffffff});
// 使用几何体和材质创建一个立方体网格（Mesh）
const cube = new THREE.Mesh(geometry, material);
// 添加立方体网格到场景中
scene.add(cube);
/***********具体相关逻辑结束**************/
/**
 * @description: 挂载完毕之后获取dom
 */
onMounted(() => {
  // 添加控制器
  const controls = new OrbitControls(camera, container.value);
  controls.enableDamping = true; // 动态阻尼系数 就是鼠标拖拽旋转灵敏度
  container.value.appendChild(renderer.domElement);
  // 监听控制器的鼠标事件，执行渲染内容
  controls.addEventListener('change', () => {
    renderer.render(scene, camera)
  })
  render();
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
  /* background-color: #f0f0f0; */
}
</style>
