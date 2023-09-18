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
// 导入 mtl格式载入库
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
// 导入obj模型格式载入库
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
// vue3 ref 
import { onMounted, ref } from "vue";

/**
 * @description: 注册container元素
 */
const container = ref();
// 声明场景
let scene: any, camera: any, renderer: any;

/*************具体相关逻辑开始****************/
/** 人物模型 */
let characterModel: any;
/** 衣服模型 */
let clothesModel;
/** 脸部纹理 */
let faceTexture: any;
/** 创建人物模型 */
// 实例化mtl loader
const mtlLoader = new MTLLoader()
// 实例化objLoader
const objLoader = new OBJLoader();

// 加载mtl
mtlLoader.load('./imgs/fitting-room/MN02-W210917XFAW0082/MN02-W210917XFAW0082.mtl', function (materials) {
  materials.preload()
  objLoader.setMaterials(materials)
  objLoader.load(
    './imgs/fitting-room/MN02-W210917XFAW0082/MN02-W210917XFAW0082.obj', (obj) => {
      //设置模型大小
      obj.scale.set(0.08, 0.08, 0.08)
      //设置模型位置
      obj.position.set(0, -90, 0);
      // 设置可以投影
      obj.children.forEach(item => {
        item.castShadow = true
        item.receiveShadow = true
      })
      characterModel = obj;
      scene.add(characterModel);
      // 进行渲染，解决模型不能立即展示问题
      render();
      pf();
    });
});

/** 创建衣服模型 */
/** @description: 实例化gltf载入库 */
const gltfLoader = new GLTFLoader();
// 加载
gltfLoader.load("./imgs/fitting-room/person.glb", (gltf) => {
  // clothesModel = gltf.scene;
  characterModel.add(gltf.scene); // 将衣服添加到人物模型中
  // 进行渲染，解决模型不能立即展示问题
  render();
})

// 加载
gltfLoader.load("./imgs/fitting-room/dress.glb", (gltf) => {
  // clothesModel = gltf.scene;
  // characterModel.add(gltf.scene); // 将衣服添加到人物模型中
  //设置模型大小
  gltf.scene.scale.set(0.08, 0.08, 0.08)
  // 设置模型位置，与人物模型位置一致
  gltf.scene.position.set(50, -90, 0);
  scene.add(gltf.scene);
  // 进行渲染，解决模型不能立即展示问题
  render();
})

// 皮肤渲染
const pf = () => {
  var skinTexture = new THREE.TextureLoader().load('./imgs/fitting-room/pf.jpg');
  var material = new THREE.MeshLambertMaterial({ map: skinTexture });

  // 遍历人物模型的子元素，找到 Mesh 并应用材质
  characterModel.traverse(function (child: any) {

    /**
     * Root_SkinnedMesh_Avatar_0_Sub_0：身体
     * Root_SkinnedMesh_Avatar_0_Sub_1: 鞋子
     * Root_SkinnedMesh_Avatar_0_Sub_2：头发
     */
    if (child instanceof THREE.Mesh && child.name == "Root_SkinnedMesh_Avatar_0_Sub_0") {
      console.log("人物模型子元素:", child)
      child.material = material;
      // face(child.material)
    }
  });
}
const face = (materialTlp: any) => {
  var skinTexture = new THREE.TextureLoader().load('./imgs/fitting-room/face.jpg');
  var material = new THREE.MeshPhongMaterial({ map: skinTexture });
  // 创建新的 MeshPhongMaterial 材质
  var newFaceMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 }); // 以红色为例
  materialTlp.traverse((child: any) => {
    if (child instanceof THREE.MeshPhongMaterial && child.name == "face") {
      console.log("人物模型11子元素:", child)
      child = material;
    }
  })
}

/*************具体相关逻辑结束****************/

/***********基础内容****************/

/**
 * @description: 创建渲染函数
 */
const render = () => {
  // 渲染
  renderer.render(scene, camera);
  // 循环渲染
  // requestAnimationFrame(render);
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
