import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import basicVertexShader from "./../assets/shader/vertexShader.glsl";
import basicFragmentShader from "./../assets/shader/fragmentShader.glsl";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 10, 20);

scene.add(camera);
const dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.set(0, 0, 9);
scene.add(dirLight);
const light = new THREE.AmbientLight(0xffffff, 0.8); // soft white light
scene.add(light);
const textureLoader = new THREE.TextureLoader();

const EARTH_RADIUS = 1.5;
const MOON_RADIUS = 1;

const earthGeo = new THREE.SphereGeometry(EARTH_RADIUS, 32, 32);
const earthMaterial = new THREE.MeshPhongMaterial({
  specular: 0x333333,
  shininess: 10,
  normalScale: new THREE.Vector2(0.85, 0.85),
  map: textureLoader.load("./texture/planets/earth_atmos_4096.jpg"),
  specularMap: textureLoader.load("./texture/planets/earth_lights_2048.jpg"),
  normalMap: textureLoader.load("./texture/planets/earth_lights_2048.jpg"),
  alphaMap: textureLoader.load("./texture/planets/earth_clouds_2048.jpg"),
});
const earth = new THREE.Mesh(earthGeo, earthMaterial);
scene.add(earth);

const moonGeo = new THREE.SphereGeometry(MOON_RADIUS, 32, 32);
const moonMaterial = new THREE.MeshPhongMaterial({
  map: textureLoader.load("./texture/planets/moon_1024.jpg"),
});
const moon = new THREE.Mesh(moonGeo, moonMaterial);
scene.add(moon);

let curve = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0, 0, 8),
    new THREE.Vector3(-10, 0, 0),
    new THREE.Vector3(0, 0, -8),
    new THREE.Vector3(10, 0, 0),
  ],
  true
);

const points = curve.getPoints(500);
const geometry = new THREE.BufferGeometry().setFromPoints(points);

const material = new THREE.LineBasicMaterial({
  transparent: true,
  opacity: 0,
});

const curveObject = new THREE.Line(geometry, material);
scene.add(curveObject);

const clock = new THREE.Clock();

//render

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function render() {
  let time = clock.getElapsedTime();
  const point = curve.getPoint(time / 20);
  earth.rotation.y += 0.01;
  moon.rotation.y += 0.005;
  moon.position.copy(point);
  // moon.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5);
  // camera.position.copy(point);
  // camera.lookAt(earth.position);
  renderer.render(scene, camera);
  // moon.position.set(Math.sin(time) * 5, 0, Math.cos(time) * 5);
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
