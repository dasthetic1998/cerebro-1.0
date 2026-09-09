import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

import { EffectComposer } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/UnrealBloomPass.js";

let scene, camera, renderer, composer;
let bloomPass;
let bloomEnabled = false;
let running = false;

const thoughtsEl = document.getElementById("thoughts");

// 🛡 SAFE DOM WRAPPER (evita crashes)
function safeText(el, text) {
  if (!el) return;
  el.innerText = text;
}

// INIT
function init() {

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("c"),
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  // LIGHT
  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(2, 2, 2);
  scene.add(light);

  // OBJECT (brain placeholder)
  const geometry = new THREE.IcosahedronGeometry(1.5, 2);
  const material = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    wireframe: true
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // POST PROCESSING (BLOOM)
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,
    0.4,
    0.85
  );

  composer.addPass(bloomPass);

  bloomPass.enabled = false;

  animate();
}

// ANIMATE LOOP
function animate() {
  requestAnimationFrame(animate);

  if (!running) return;

  scene.rotationY = scene.rotationY || 0;
  scene.rotationY += 0.002;

  scene.rotation.y = scene.rotationY;

  safeText(thoughtsEl, "Neural activity: " + Math.random().toFixed(4));

  composer.render();
}

// TOGGLE BLOOM SAFE MODE
document.getElementById("toggleBloom").onclick = () => {
  bloomEnabled = !bloomEnabled;
  bloomPass.enabled = bloomEnabled;
};

// START
document.getElementById("startBtn").onclick = () => {
  running = true;
  init();
};
