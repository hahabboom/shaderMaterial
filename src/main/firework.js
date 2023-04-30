import * as THREE from "three";
import basicVertexShader from "../assets/fireworkShader/vertexShader.glsl";
import basicFragmentShader from "../assets/fireworkShader/fragmentShader.glsl";
import fireworkVertex from "../assets/fireworkShader/fireworkVertex.glsl";
import fireworkFragment from "../assets/fireworkShader/fireworkFragment.glsl";

export default class Firework {
  constructor(color, to, from = { x: 0, y: 0, z: 0 }) {
    this.color = new THREE.Color(color);
    this.startGeo = new THREE.BufferGeometry();
    const startPosition = new Float32Array(3);
    startPosition[0] = from.x;
    startPosition[1] = from.y;
    startPosition[2] = from.z;
    this.startGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(startPosition, 3)
    );
    const endPosition = new Float32Array(3);
    endPosition[0] = to.x - from.x;
    endPosition[1] = to.y - from.y;
    endPosition[2] = to.z - from.z;

    this.startGeo.setAttribute(
      "aStep",
      new THREE.BufferAttribute(endPosition, 3)
    );
    this.material = new THREE.ShaderMaterial({
      vertexShader: basicVertexShader,
      fragmentShader: basicFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: {
          value: 0,
        },
        uSize: {
          value: 20,
        },
        uColor: {
          value: this.color,
        },
      },
    });

    this.startPoint = new THREE.Points(this.startGeo, this.material);
    this.clock = new THREE.Clock();

    this.fireworkGeo = new THREE.BufferGeometry();
    this.fireworkCount = 180 + Math.floor(Math.random() * 180);
    const fireworkPosition = new Float32Array(this.fireworkCount * 3);
    const scale = new Float32Array(this.fireworkCount);
    const directionPosition = new Float32Array(this.fireworkCount * 3);
    for (let i = 0; i < this.fireworkCount; i++) {
      fireworkPosition[i * 3 + 0] = to.x;
      fireworkPosition[i * 3 + 1] = to.y;
      fireworkPosition[i * 3 + 2] = to.z;
      scale[i] = Math.random();

      let theta = Math.random() * 2 * Math.PI;
      let beta = Math.random() * 2 * Math.PI;
      let r = Math.random();

      directionPosition[i * 3 + 0] = r * Math.sin(theta) + r * Math.sin(beta);
      directionPosition[i * 3 + 1] = r * Math.cos(theta) + r * Math.cos(beta);
      directionPosition[i * 3 + 2] = r * Math.sin(theta) + r * Math.cos(beta);
    }
    this.fireworkGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(fireworkPosition, 3)
    );
    this.fireworkGeo.setAttribute(
      "aScale",
      new THREE.BufferAttribute(scale, 1)
    );
    this.fireworkGeo.setAttribute(
      "aRandom",
      new THREE.BufferAttribute(directionPosition, 3)
    );
    this.fireworkMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: {
          value: 0,
        },
        uSize: {
          value: 0,
        },
        uColor: {
          value: this.color,
        },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexShader: fireworkVertex,
      fragmentShader: fireworkFragment,
    });
    this.fireworks = new THREE.Points(this.fireworkGeo, this.fireworkMaterial);

    // 创建音频
    this.linstener = new THREE.AudioListener();
    this.linstener1 = new THREE.AudioListener();
    this.sound = new THREE.Audio(this.linstener);
    this.sendSound = new THREE.Audio(this.linstener1);

    // 创建音频加载器
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(
      `./audio/pow${Math.floor(Math.random() * 4) + 1}.ogg`,
      (buffer) => {
        this.sound.setBuffer(buffer);
        this.sound.setLoop(false);
        this.sound.setVolume(1);
      }
    );

    audioLoader.load(`./audio/send.mp3`, (buffer) => {
      this.sendSound.setBuffer(buffer);
      this.sendSound.setLoop(false);
      this.sendSound.setVolume(1);
    });
  }
  addScene(scene, camera) {
    scene.add(this.startPoint);
    scene.add(this.fireworks);
    this.scene = scene;
  }
  update() {
    let eTime = this.clock.getElapsedTime();
    if (eTime > 0.2 && eTime < 1) {
      if (!this.sendSound.isPlaying && !this.sendSoundplay) {
        this.sendSound.play();
        this.sendSoundplay = true;
      }
      this.material.uniforms.uTime.value = eTime;
      this.material.uniforms.uSize.value = 20;
    } else if (eTime > 0.2) {
      const time = eTime - 1;
      this.material.uniforms.uSize.value = 0;
      this.startPoint.clear();
      this.startGeo.dispose();
      this.material.dispose();
      if (!this.sound.isPlaying && !this.play) {
        this.sound.play();
        this.play = true;
      }
      this.fireworkMaterial.uniforms.uSize.value = 20;
      this.fireworkMaterial.uniforms.uTime.value = time;

      if (time > 5) {
        this.fireworkMaterial.uniforms.uSize.value = 0;
        this.fireworks.clear();
        this.fireworkGeo.dispose();
        this.fireworkMaterial.dispose();
        return "remove";
      }
    }
  }
}
