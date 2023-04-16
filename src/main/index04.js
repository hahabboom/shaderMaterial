import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import basicVertexShader from "../assets/galaxyShader/vertexShader.glsl";
import basicFragmentShader from "../assets/galaxyShader/fragmentShader.glsl";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import gsap from "gsap";
import * as dat from "dat.gui";
import { PointsMaterial } from "three";
const gui = new dat.GUI();

// 烟雾,云朵效果
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 2);
scene.add(camera);

let axis = new THREE.AxesHelper(5);
scene.add(axis);

const texTureLoader = new THREE.TextureLoader();
const texture = texTureLoader.load("texture/particles/3.png");
const texture1 = texTureLoader.load("texture/particles/4.png");
const texture2 = texTureLoader.load("texture/particles/8.png");
const params = {
  count: 10000,
  size: 0.4,
  branch: 3,
  radius: 10,
  // color: "#0000FF",
  endColor: "#ff6030",
  // endColor: "#FFC0CB",
  color: "#113984",
  scale: 0.3,
};

let galaxyGeo = null;
let points = null;
const galaxyMaterial = new THREE.ShaderMaterial({
  vertexShader: basicVertexShader,
  fragmentShader: basicFragmentShader,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
  uniforms: {
    uTexture: {
      value: texture,
    },
    uTexture1: {
      value: texture1,
    },
    uTexture2: {
      value: texture2,
    },
    uTime: {
      value: 0,
    },
    color: {},
  },
});
const generateGalaxy = () => {
  galaxyGeo = new THREE.BufferGeometry();
  const position = new Float32Array(params.count * 3);
  const color = new Float32Array(params.count * 3);
  const centerColor = new THREE.Color(params.color);
  const endColor = new THREE.Color(params.endColor);
  const imgIndex = new Float32Array(params.count);
  const scales = new Float32Array(params.count);

  for (let i = 0; i < params.count; i++) {
    let cur = i * 3;
    const angel = (i % params.branch) * ((Math.PI * 2) / params.branch);
    const distance = Math.random() * params.radius * Math.pow(Math.random(), 3);
    const randomX =
      (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;
    const randomY =
      (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;
    const randomZ =
      (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;
    position[cur] =
      Math.cos(angel + distance * params.scale) * distance + randomX;
    position[cur + 1] = randomY;
    position[cur + 2] =
      Math.sin(angel + distance * params.scale) * distance + randomZ;

    const mixColor = centerColor.clone();
    mixColor.lerp(endColor, distance / params.radius);
    color[cur] = mixColor.r;
    color[cur + 1] = mixColor.g;
    color[cur + 2] = mixColor.b;
    imgIndex[cur] = i % 3;
    scales[cur] = Math.random();
  }
  galaxyGeo.setAttribute("position", new THREE.BufferAttribute(position, 3));
  galaxyGeo.setAttribute("color", new THREE.BufferAttribute(color, 3));
  galaxyGeo.setAttribute("imgIndex", new THREE.BufferAttribute(imgIndex, 1));
  galaxyGeo.setAttribute("scales", new THREE.BufferAttribute(scales, 1));
  galaxyMaterial.uniforms.color.value = color;
  points = new THREE.Points(galaxyGeo, galaxyMaterial);

  scene.add(points);
};

generateGalaxy();

const clock = new THREE.Clock();

//render

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function render() {
  let time = clock.getElapsedTime();
  // controls.update();
  galaxyMaterial.uniforms.uTime.value = time;
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
