import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import basicVertexShader from "../assets/waterShader/vertexShader.glsl";
import basicFragmentShader from "../assets/waterShader/fragmentShader.glsl";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import gsap from "gsap";
import * as dat from "dat.gui";
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

const params = {
  uWaresFrequency: 15,
  uScaleHeight: 0.03,
  uxzScale: 1.5,
  uNoiseFrequency: 10,
  uNoiseScale: 1.5,
  uLowColor: "#041b48",
  uHighColor: "#89abc0",
  uXSpeed: 1,
  uZSpeed: 1,
  uNoiseSpeed: 1,
  uOpacity: 1,
};
let shaderMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  vertexShader: basicVertexShader,
  fragmentShader: basicFragmentShader,
  transparent: true,
  uniforms: {
    uWaresFrequency: {
      value: params.uWaresFrequency,
    },
    uScaleHeight: {
      value: params.uScaleHeight,
    },
    uNoiseFrequency: {
      value: params.uNoiseFrequency,
    },
    uNoiseScale: {
      value: params.uNoiseScale,
    },
    uxzScale: {
      value: params.uxzScale,
    },
    uTime: {
      value: params.uTime,
    },
    uLowColor: {
      value: new THREE.Color(params.uLowColor),
    },
    uHighColor: {
      value: new THREE.Color(params.uHighColor),
    },
    uXSpeed: {
      value: params.uXSpeed,
    },
    uZSpeed: {
      value: params.uZSpeed,
    },
    uNoiseSpeed: {
      value: params.uNoiseSpeed,
    },
    uOpacity: {
      value: params.uOpacity,
    },
  },
});
gui
  .add(params, "uWaresFrequency")
  .min(1)
  .max(100)
  .step(0.1)
  .onChange((value) => {
    shaderMaterial.uniforms.uWaresFrequency.value = value;
  });

gui
  .add(params, "uScaleHeight")
  .min(0)
  .max(0.2)
  .step(0.001)
  .onChange((value) => {
    shaderMaterial.uniforms.uScaleHeight.value = value;
  });
gui
  .add(params, "uNoiseFrequency")
  .min(1)
  .max(100)
  .step(0.1)
  .onChange((value) => {
    shaderMaterial.uniforms.uNoiseFrequency.value = value;
  });

gui
  .add(params, "uNoiseScale")
  .min(0)
  .max(5)
  .step(0.001)
  .onChange((value) => {
    shaderMaterial.uniforms.uNoiseScale.value = value;
  });
gui
  .add(params, "uxzScale")
  .min(1)
  .max(5)
  .step(0.01)
  .onChange((value) => {
    shaderMaterial.uniforms.uxzScale.value = value;
  });

gui.addColor(params, "uLowColor").onChange((value) => {
  shaderMaterial.uniforms.uLowColor.value = new THREE.Color(value);
});

gui.addColor(params, "uHighColor").onChange((value) => {
  shaderMaterial.uniforms.uHighColor.value = new THREE.Color(value);
});

gui
  .add(params, "uXSpeed")
  .min(0)
  .max(5)
  .step(0.01)
  .onChange((value) => {
    shaderMaterial.uniforms.uXSpeed.value = value;
  });
gui
  .add(params, "uZSpeed")
  .min(0)
  .max(5)
  .step(0.1)
  .onChange((value) => {
    shaderMaterial.uniforms.uZSpeed.value = value;
  });

gui
  .add(params, "uNoiseSpeed")
  .min(0)
  .max(5)
  .step(0.1)
  .onChange((value) => {
    shaderMaterial.uniforms.uNoiseSpeed.value = value;
  });
gui
  .add(params, "uOpacity")
  .min(0)
  .max(1)
  .step(0.01)
  .onChange((value) => {
    shaderMaterial.uniforms.uOpacity.value = value;
  });

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1, 1024, 1024),
  shaderMaterial
);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

let axis = new THREE.AxesHelper(5);
scene.add(axis);

const clock = new THREE.Clock();

//render

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function render() {
  let time = clock.getElapsedTime();
  shaderMaterial.uniforms.uTime.value = time;
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
