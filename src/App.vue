<script setup lang="ts">
import {
  Scene,
  PerspectiveCamera,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  WebGLRenderer,
  TextureLoader,
  Vector2,
  CircleGeometry,
  LineBasicMaterial,
  DoubleSide,
  Raycaster
} from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { onMounted, ref } from "vue";

// 初始化场景
const scene = new Scene();
// 初始化相机
const camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
// 设置相机位置
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = -0.4;
// 初始化渲染器
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const container = ref();

const render = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
// 当前场景 客厅
let currentHome = "saloon";


// const material = new MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new Mesh(geometry, material);
// scene.add(cube);
// home1 
let arr = ["left", "right", "top", "bottom", "front", "back"];
interface IHome {
  materials: Array<any>;
  btnPosition: Array<number>;
};
interface IHomes {
  [key: string]: IHome;
}
// 房间数据
let homes: IHomes = {
  saloon: {
    materials: [],
    btnPosition: [-16, -8, -9]
  },
  bedroom: {
    materials: [],
    btnPosition: [18, -8, -7]
  },
}
const homeMaterials = (type: string) => {
  arr.forEach((item) => {
    // 纹理加载
    const texture = new TextureLoader().load(`./imgs/${type}/${type}_${item}.jpg`)
     // 创建材质
    const material = new MeshBasicMaterial({ map: texture, side: DoubleSide })
    // 放入材质
    switch (type) {
      case "saloon":
        homes.saloon.materials.push(material);
        break;
      case "bedroom":
        homes.bedroom.materials.push(material);
        break;
    }
  });
}
/**
 * 光线投射Raycaster
 * 这个类用于进行raycasting（光线投射）。 光线投射用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）。
 */
var raycaster = new Raycaster();
/**
 * 二维向量（Vector2）
 * 表示2D vector（二维向量）的类。 一个二维向量是一对有顺序的数字（标记为x和y），可用来表示很多事物，例如：
 * 一个位于二维空间中的点（例如一个在平面上的点）。
 * 一个在平面上的方向与长度的定义。在three.js中，长度总是从(0, 0)到(x, y)的 Euclidean distance（欧几里德距离，即直线距离）， 方向也是从(0, 0)到(x, y)的方向。任意的、有顺序的一对数字。
 * 其他的一些事物也可以使用二维向量进行表示，比如说动量矢量、复数等等；但以上这些是它在three.js中的常用用途。
 * 对 Vector2 实例进行遍历将按相应的顺序生成它的分量 (x, y)。
*/
var mouse = new Vector2();

const onMouseDown = (event: any) => {
  // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  //将平面坐标系转为世界坐标系
  raycaster.setFromCamera(mouse, camera);
  //得到点击的几何体
  var raycasters = raycaster.intersectObjects(scene.children);
  if (raycasters[0].object.name === 'locationBtn') {
    alert(raycasters[0].object.name)
    // 当前房间
    currentHome = currentHome === "saloon" ? "bedroom" : "saloon";
    // 重新加载房间信息
    initHome();
  }
}
//监视鼠标左键按下事件
window.addEventListener("mousedown", onMouseDown, false);

/** 初始化房间 */
const initHome = () => {
  // 客厅材质
  homeMaterials(currentHome);

  // 切换场景前把之前的物体清除掉
  // getObjectByName 用于来匹配子物体中Object3D.name属性的字符串
  const homeMeshName = scene.getObjectByName("homeMesh")
  const locationBtnName = scene.getObjectByName('locationBtn')
  if (homeMeshName && locationBtnName) {
    scene.remove(homeMeshName, locationBtnName)
  }
  // 添加立方体
  const geometry = new BoxGeometry(40, 40, 40);
  // 根据几何体和材质创建物体
  console.log(homes[currentHome].materials);
  const cube = new Mesh(geometry, homes[currentHome].materials);
  cube.castShadow = true
  // 定位物体的位置
  cube.position.set(0, 0, 0);
  // 将物体进行反转
  cube.geometry.scale(1, 1, -1);
  // 给物体定义名称
  cube.name = "homeMesh"
  scene.add(cube);

  // 添加一个圆形按钮，点击后跳转到其他房间场景
  const planeGeometry = new CircleGeometry(1.2, 20);
  // 创建基础线条材质（LineBasicMaterial）一种用于绘制线框样式几何体的材质。
  const planeMaterial = new LineBasicMaterial({ color: 0xffffff, side: DoubleSide });
  // 根据几何体和材质创建物体
  const planeCube = new Mesh(planeGeometry, planeMaterial);
  // 定位物体的位置
  planeCube.position.set(...homes[currentHome].btnPosition)
  // 定位物体的位置 以x为轴顺时针旋转90°
  planeCube.rotateX(0.5 * Math.PI)
  // 给物体定义名称
  planeCube.name = "locationBtn"
  // 将物体添加到场景
  scene.add(planeCube)
}



// 挂在完毕之后获取dom
onMounted(() => {

  // 添加控制器
  const controls = new OrbitControls(camera, container.value);
  controls.enableDamping = true; // 动态阻尼系数 就是鼠标拖拽旋转灵敏度
  container.value.appendChild(renderer.domElement);
  // 监听控制器的鼠标事件，执行渲染内容
  controls.addEventListener('change', () => {
    renderer.render(scene, camera)
  })
  initHome();
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
