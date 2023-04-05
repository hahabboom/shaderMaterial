import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import basicVertexShader from "./../assets/rawShader/vertexShader.glsl";
import basicFragmentShader from "./../assets/rawShader/fragmentShader.glsl";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 0, 10);

scene.add(camera);

const loader = new THREE.TextureLoader();
const flag = loader.load("./texture/flag.jpg");

const plane = new THREE.PlaneGeometry(1, 1, 64, 64);
const material = new THREE.RawShaderMaterial({
  vertexShader: basicVertexShader,
  fragmentShader: basicFragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: {
      value: 0,
    },
    uTexture: {
      value: flag,
    },
  },
});
const mesh = new THREE.Mesh(plane, material);
scene.add(mesh);
const axis = new THREE.AxesHelper(5);
scene.add(axis);

const clock = new THREE.Clock();

//render

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function render() {
  let time = clock.getElapsedTime();
  material.uniforms.uTime.value = time;
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();

// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});
