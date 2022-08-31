<script setup lang="ts">
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  sRGBEncoding,
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  SphereGeometry,
  TextureLoader,
  VideoTexture,
  Vector2,
  CircleBufferGeometry,
  EquirectangularReflectionMapping,
  DirectionalLight,
} from "three";
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

import { onMounted, ref } from "vue";
/** 初始化场景 */
const scene = new Scene();
/** 初始化相机：透视相机 */
const camera = new PerspectiveCamera(
  75, // 角度 看到景物宽广程度
  window.innerWidth / window.innerHeight, // 屏幕宽高
  0.1, // 相机看到的最小距离
  2000 // 相机看到的最大距离
)
// 设置相机位置
camera.position.set(-50, 50, 130);
// 更新摄像头宽高比例 全屏
camera.aspect = window.innerWidth / window.innerHeight;
// 更新摄像头投影矩阵
camera.updateProjectionMatrix();
// 添加相机到场景里面
scene.add(camera);
/** 初始化渲染器 */ 
const renderer = new WebGLRenderer({
  antialias: true, // 设置抗锯齿
  // 对数深度缓冲区
  logarithmicDepthBuffer: true
})
// 编码
renderer.outputEncoding = sRGBEncoding;
// 这是渲染器宽高
renderer.setSize(window.innerWidth, window.innerHeight);

// 监听屏幕的大小改变，修改渲染器的宽高，相机的比例
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
/**
 * @description: 注册container元素
 */
const container = ref();

/**
 * @description: 渲染场景和相机内容
 */
const render = () => {
  // 渲染场景
  renderer.render(scene, camera);
  // 引擎自动更新渲染器
  requestAnimationFrame(render);
}

/**
 * @description: 创建一个巨大的天空球
 */
const skyGeometry = new SphereGeometry(1000, 60, 60);
/**
 * @description: 初始化纹理
 */
let texture = new TextureLoader().load("./imgs/isle/textures/sky.jpg");
/**
 * @description: 创建基础材质
 */
const skyMaterial = new MeshBasicMaterial({
  map: texture,
})
// 翻转球
skyGeometry.scale(1, 1, -1);
/**
 * @description: 根据几何体和材质创建物体
 */
const skyCube = new Mesh(skyGeometry, skyMaterial);
scene.add(skyCube);

/**
 * @description: 视频纹理
 */
const video = document.createElement("video");
video.src = "./imgs/isle/textures/sky.mp4";
video.loop = true;

window.addEventListener("click", (e) => {
  // 当鼠标移动的时候播放视频
  // 判断视频是否处于播放状态
  if (video.paused) {
    video.play();
    let texture = new VideoTexture(video);
    // 替换材质
    skyMaterial.map = texture;
    skyMaterial.map.needsUpdate = true;
    scene.background = texture;
    scene.environment = texture;
  }
})

/**
 * @description: 载入环境纹理Hdr
 */
const hdrLoader = new RGBELoader();
hdrLoader.loadAsync("./imgs/isle/050.hdr").then((texture) => {
  texture.mapping = EquirectangularReflectionMapping;
  // 设置场景背景
  scene.background = texture;
  // 设置场景环境
  scene.environment = texture;
})

/** @description: 添加平行光 */
const light = new DirectionalLight(0xffffff, 1);
light.position.set(-100, 100, 10);
scene.add(light);

/** @description: 创建水面 */
const waterGeometry = new CircleBufferGeometry(300, 64) // 对半径300的圆进行64份切分
/** @description: 创建水的材质 */
const water = new Water(waterGeometry, {
  textureWidth: 1024, // 水面宽度
  textureHeight: 1024, // 水面高度
  color: 0xeeeeff, // 水面颜色
  flowDirection: new Vector2(1, 1), // 水流方向
  normalMap0: new TextureLoader().load("./imgs/isle/textures/water/Water_2_M_Normal.jpg"),
  scale: 1, // 水面波纹大小
})
// 水平面抬高3米
water.position.y = 3;
// 水面旋转之水平
water.rotation.x = -Math.PI / 2;
scene.add(water)

// 添加小岛模型
/** @description: 实例化gltf载入库 */
const loader = new GLTFLoader();
/** @description: 实例化draco载入库 */
const dracoLoader = new DRACOLoader();
// 添加draco载入库 设置解压库文件
dracoLoader.setDecoderPath("./imgs/isle/draco/");
// 解压 
loader.setDRACOLoader(dracoLoader)
// 加载
loader.load("./imgs/isle/island2.glb",(gltf)=>{
  scene.add(gltf.scene)
})

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
  background-color: #f0f0f0;
}
</style>
