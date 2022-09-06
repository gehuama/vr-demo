<script setup lang="ts">
// 导入three库
import * as THREE from "three";
// 导入轨道控制器 旋转看整个空间效果
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
// 导入gltf载入库
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// 导入解压模型库
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
// 导入着色器代码
import fragmentShader from "../shader/fragmentShader.glsl?raw";
// 2d渲染器 2d 对象
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer"

import { onMounted, ref } from "vue";
import { BufferGeometry, LineSegments } from "three";
/**
 * @description: 注册container元素
 */
const container = ref();

/**
 * @description: 创建场景
 */
let scene = new THREE.Scene();
/**
 * @description: 初始化相机
 */
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// 设置相机位置
camera.position.set(0, 5, 10);
// 将相机添加到场景中
scene.add(camera);
/** @description: 创建渲染器 */
let renderer = new THREE.WebGLRenderer();
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
// 设置渲染器尺寸
renderer.setSize(window.innerWidth, window.innerHeight);
/**
   * @description: 声明变量-标签渲染器
   */
let labelRenderer: CSS2DRenderer;
/**
 * @description: 声明导弹模型
 */
let missile: THREE.Object3D<THREE.Event>,
  /**
   * @description: 乌克兰地图
   */
  mapWkl,
  /**
   * @description: 俄罗斯地图
   */
  mapEls;
/**
 * @description: 声明曲线
 */
let path;
/**
 * @description: gltf 模型加载
 * @return {*}
 */
let loader = new GLTFLoader();
let curvePath: THREE.CatmullRomCurve3;
// 模型路径
loader.load("./imgs/missile/ew8.glb", (gltf) => {
  // 将加载的模型添加到场景中
  // scene.add(gltf.scene);
  // 输出
  console.log(gltf.scene);
  mapEls = gltf.scene.children[0];
  path = gltf.scene.children[2];
  mapWkl = gltf.scene.children[1];
  missile = gltf.scene.children[3];
  // 把物体添加到场景中
  scene.add(missile);
  scene.add(mapWkl);
  scene.add(mapEls);

  /** @description: 创建乌克兰文字dom */
  const wklDiv = document.createElement("div");
  wklDiv.className = "label";
  wklDiv.textContent = "乌克兰";
  /** @description: 渲染对象 */
  const wklLabel = new CSS2DObject(wklDiv);
  wklLabel.position.set(0, 0.3, 0);
  mapWkl.add(wklLabel)

  /** @description: 创建乌克兰文字dom */
  const ElsDiv = document.createElement("div");
  ElsDiv.className = "label";
  ElsDiv.textContent = "俄罗斯";
  /** @description: 渲染对象 */
  const ElsLabel = new CSS2DObject(ElsDiv);
  ElsLabel.position.set(3, 2, 0);
  mapEls.add(ElsLabel)
  // 根据点创建曲线
  let points = [];
  console.log(path);
  // 将点添加到数组中
  for (let i = (path as unknown as LineSegments).geometry.attributes.position.count - 1; i >= 0; i--) {
    points.push(
      new THREE.Vector3(
        (path as unknown as LineSegments).geometry.attributes.position.array[i * 3],
        (path as unknown as LineSegments).geometry.attributes.position.array[i * 3 + 1],
        (path as unknown as LineSegments).geometry.attributes.position.array[i * 3 + 2])
    );
  }
  curvePath = new THREE.CatmullRomCurve3(points);
});
/** @description: 创建平行光 */
let light = new THREE.DirectionalLight(0xffffff, 2);
// 设置光源位置
light.position.set(1, 10, 1);
// 将光源添加到场景
scene.add(light);
/** @description: 创建平行光 */
let light2 = new THREE.DirectionalLight(0xffffff, 0.5);
// 设置光源位置
light.position.set(-1, -1, -1);
// 将光源添加到场景
scene.add(light2);

const params = {
  iTime: { value: 0.5 }
}

// 添加声音
const listener = new THREE.AudioListener();
const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();
audioLoader.load("./imgs/missile/bomb.mp3", (buffer) => {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.5);
  sound.play();
});
/** @description: 创建精灵材质 */
let spriteMaterial = new THREE.SpriteMaterial({
  color: 0xffffff,
  blending: THREE.AdditiveBlending,
})


// 在onbeforecompile 函数中添加着色器代码
spriteMaterial.onBeforeCompile = (shader) => {
  // 在着色器代码中添加着色器代码
  shader.vertexShader = shader.vertexShader.replace(
    // 替换common
    "#include <common>",
    `
    #include <common>
    varying vec2 vUv;
    `
  )
  shader.vertexShader = shader.vertexShader.replace(
    // 设置 vUv
    "#include <uv_vertex>",
    `
    #include <uv_vertex>
    vUv = uv;
    `
  )
  // 替换片元着色器
  shader.fragmentShader = fragmentShader;
  // 添加 uniform
  shader.uniforms.iResolution = {
    value: new THREE.Vector2(window.innerWidth, window.innerHeight)
  }
  shader.uniforms.iTime = params.iTime
  shader.uniforms.iMouse = {
    value: new THREE.Vector2(0, 0)
  }
  shader.uniforms.iChannel0 = {
    value: new THREE.TextureLoader
      ().load("./imgs/missile/assets/iChannel0.png")
  }
  shader.uniforms.iChannel1 = {
    value: new THREE.TextureLoader
      ().load("./imgs/missile/assets/iChannel1.png")
  }
  shader.uniforms.iChannel2 = {
    value: new THREE.TextureLoader
      ().load("./imgs/missile/assets/iChannel2.png")
  }
}
/** @description: 添加一个sprite */
let sprite = new THREE.Sprite(spriteMaterial);
// 设置精灵尺寸
// sprite.scale.set(0.5, 0.5, 0.5);
// 设置精灵位置
sprite.position.set(-5.5, 0.8, 0);
// 将精灵添加到场景中
scene.add(sprite);
// 创建clock
let clock = new THREE.Clock();


/**
 * @description: 创建渲染函数
 */
function render() {
  // 渲染
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera)
  // 循环渲染
  requestAnimationFrame(render);
  // 设置5秒飞行一次
  let t = clock.getElapsedTime() % 5;
  t = t / 5;
  // 设置导弹飞行路径
  // 先判断curvePath是否存在，如果存在就设置导弹飞行路径
  if (curvePath) {
    const point = curvePath.getPointAt(t);
    missile.position.set(point.x, point.y, point.z);
    if (t + 0.1 < 1) {
      const point1 = curvePath.getPointAt(t + 0.01);
      // 设置导弹飞行方向
      missile.lookAt(point1);
    }
    if (t > 0.95) {
      scene.add(sprite);
      // 判断sound是否播放，如果没有播放就播放
      if (!sound.isPlaying) {
        sound.play();
      }

    }
  }
  params.iTime.value = t * 10;
}



/**
 * @description: 挂载完毕之后获取dom
 */
onMounted(() => {
  // 创建控制器
  let controls = new OrbitControls(camera, container.value);
  controls.enableDamping = true; // 动态阻尼系数 就是鼠标拖拽旋转灵敏度

  // 标签渲染器
  labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0px";

  container.value.appendChild(renderer.domElement);
  container.value.appendChild(labelRenderer.domElement);
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

canvas {
  background-image: url("../imgs/surround/star.jpg");
  background-size: cover;
}

.label {
  color: #FFFFFF;
  font-size: 16px;
}
</style>
