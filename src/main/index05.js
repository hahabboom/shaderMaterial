import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import * as dat from "dat.gui";
// import vertexShader from "../shaders/flylight/vertex.glsl";
// import fragmentShader from "../shaders/flylight/fragment.glsl";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";

import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";
import { SSAARenderPass } from "three/examples/jsm/postprocessing/SSAARenderPass";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

import Fireworks from "./firework";

// 导入水模块
import { Water } from "three/examples/jsm/objects/Water2";

const gui = new dat.GUI();

// 初始化场景
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  90,
  window.innerHeight / window.innerHeight,
  0.1,
  1000
);
// 设置相机位置
camera.position.set(-5, 8, 30);
// 更新摄像头
camera.aspect = window.innerWidth / window.innerHeight;
//   更新摄像机的投影矩阵
camera.updateProjectionMatrix();
scene.add(camera);

// 创建纹理加载器对象
const rgbeLoader = new RGBELoader();
rgbeLoader.loadAsync("./texture/dust.hdr").then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});

const gltfLoader = new GLTFLoader();
gltfLoader.load("./model/newyears_min.glb", (gltf) => {
  scene.add(gltf.scene);
  const waterGeometry = new THREE.PlaneGeometry(100, 100);
  let water = new Water(waterGeometry, {
    scale: 4,
    textureHeight: 1024,
    textureWidth: 1024,
  });
  water.position.y = 1;
  water.rotation.x = -Math.PI / 2;
  scene.add(water);
});

// 设置创建烟花函数
let createFireworks = () => {
  let color = `hsl(${Math.floor(Math.random() * 360)},100%,80%)`;
  let position = {
    x: (Math.random() - 0.5) * 40,
    z: -(Math.random() - 0.5) * 40,
    y: 3 + Math.random() * 15,
  };

  // 随机生成颜色和烟花放的位置
  let firework = new Fireworks(color, position);
  firework.addScene(scene, camera);
  fireworks.push(firework);
};
// 监听点击事件
window.addEventListener("click", createFireworks);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
//生成特效
const effectComposer = new EffectComposer(renderer);
effectComposer.setSize(window.innerWidth, window.innerHeight);

const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

// 点效果
// const dotScreenPass = new DotScreenPass();
// dotScreenPass.enabled = true;
// effectComposer.addPass(dotScreenPass);

// 抗锯齿
// const smaaPass = new SMAAPass();
// effectComposer.addPass(smaaPass);

// 发光效果
// const unrealBloomPass = new UnrealBloomPass();
// effectComposer.addPass(unrealBloomPass);

// 屏幕闪动
const glitchPass = new GlitchPass();
effectComposer.addPass(glitchPass);
// 初始化渲染器
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// 监听屏幕大小改变的变化，设置渲染的尺寸
window.addEventListener("resize", () => {
  //   console.log("resize");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();
  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比例
  renderer.setPixelRatio(window.devicePixelRatio);

  effectComposer.setSize(window.innerWidth, window.innerHeight);
  effectComposer.setPixelRatio(window.devicePixelRatio);
});
gui.add(renderer, "toneMappingExposure").min(0).max(2).step(0.01);
document.body.appendChild(renderer.domElement);

// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼
controls.enableDamping = true;
// 设置自动旋转
// controls.autoRotate = true;
// controls.autoRotateSpeed = 0.1;

const clock = new THREE.Clock();
// 管理烟花
let fireworks = [];
function animate(t) {
  controls.update();
  fireworks.forEach((item, i) => {
    const type = item.update();
    if (type == "remove") {
      fireworks.splice(i, 1);
    }
  });

  requestAnimationFrame(animate);
  // 使用渲染器渲染相机看这个场景的内容渲染出来
  effectComposer.render();
}

animate();
