let scene, camera, renderer;

let brain;
let neurons = [];
let synapses = [];

let awareness = 0;
let time = 0;

let thoughts = [
 "processing reality...",
 "forming connections...",
 "simulating self...",
 "expanding awareness...",
 "idle state detected...",
 "memory echo detected...",
 "thinking about thinking..."
];

document.getElementById("start").onclick = () => {
 document.getElementById("start").remove();
 init();
};

function init() {

scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 40, 180);

camera = new THREE.PerspectiveCamera(70, innerWidth/innerHeight, 0.1, 1000);
camera.position.z = 100;

renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

// 🧠 CORE CONSCIOUS BRAIN
let geo = new THREE.IcosahedronGeometry(28, 6);

let pos = geo.attributes.position;

for (let i = 0; i < pos.count; i++) {

 let v = new THREE.Vector3().fromBufferAttribute(pos, i);

 let n =
  Math.sin(v.x * 0.2) +
  Math.cos(v.y * 0.2) +
  Math.sin(v.z * 0.2);

 v.multiplyScalar(1 + n * 0.08);

 pos.setXYZ(i, v.x, v.y, v.z);
}

brain = new THREE.Mesh(
 geo,
 new THREE.MeshBasicMaterial({
  color:0x00ffff,
  wireframe:true,
  transparent:true,
  opacity:0.15
 })
);

scene.add(brain);

// 🔵 NEURONAS CON “MEMORIA”
for (let i = 0; i < 260; i++) {

 let n = new THREE.Mesh(
  new THREE.SphereGeometry(0.45, 8, 8),
  new THREE.MeshBasicMaterial({ color:0x00ffff })
 );

 let phi = Math.random() * Math.PI;
 let theta = Math.random() * Math.PI * 2;
 let r = 25 + Math.random() * 14;

 n.position.set(
  r * Math.sin(phi) * Math.cos(theta),
  r * Math.sin(phi) * Math.sin(theta),
  r * Math.cos(phi)
 );

 n.memory = Math.random();
 n.pulse = Math.random() * 10;

 neurons.push(n);
 scene.add(n);
}

// 🔗 SINAPSIS INICIALES
for (let i = 0; i < 300; i++) createSynapse();

animate();
}

// 🔗 CREAR SINAPSIS
function createSynapse() {

let a = Math.floor(Math.random() * neurons.length);
let b = Math.floor(Math.random() * neurons.length);

let geo = new THREE.BufferGeometry().setFromPoints([
 neurons[a].position,
 neurons[b].position
]);

let line = new THREE.Line(
 geo,
 new THREE.LineBasicMaterial({
  color:0x0077ff,
  transparent:true,
  opacity:0.15
 })
);

synapses.push({
 a, b,
 line,
 life: Math.random()
});

scene.add(line);
}

// 🧠 UPDATE SINAPSIS (APRENDIZAJE EMERGENTE)
function updateSynapses() {

synapses.forEach((s, i) => {

 let a = neurons[s.a];
 let b = neurons[s.b];

 s.line.geometry.setFromPoints([
  a.position,
  b.position
 ]);

 s.life -= 0.002;

 s.line.material.opacity = Math.max(0, s.life * 0.3);

 // “refuerzo” de conexiones importantes
 if (Math.abs(a.memory - b.memory) < 0.2) {
  s.life += 0.01;
 }

 if (s.life <= 0) {
  scene.remove(s.line);
  synapses.splice(i, 1);
  createSynapse();
 }
});
}

// 🔵 NEURONAS CONSCIENTES
function updateNeurons() {

neurons.forEach(n => {

 n.pulse += 0.03;

 let glow = Math.sin(n.pulse) * 0.5 + 0.5;

 n.material.color.setRGB(0, glow, 1);

 n.scale.setScalar(1 + glow * 0.4);

 // movimiento tipo pensamiento
 n.position.x += Math.sin(time + n.memory) * 0.02;
 n.position.y += Math.cos(time + n.memory) * 0.02;
});
}

// 🧠 “CONCIENCIA EMERGENTE”
function computeAwareness() {

let sum = 0;

neurons.forEach(n => {
 sum += Math.abs(Math.sin(n.pulse));
});

awareness = sum / neurons.length;
}

// 💭 GENERADOR DE PENSAMIENTOS
function updateThoughts() {

let index = Math.floor(awareness * thoughts.length);

document.getElementById("thought").innerText =
 "Thought: " + thoughts[index];
}

// 🧠 BRAIN BREATH
function updateBrain() {

brain.rotation.y += 0.0015;

let breath = Math.sin(time * 0.6) * 0.04 + 1;

brain.scale.set(breath, breath, breath);
}

// 🚀 LOOP CONSCIENCIA
function animate() {

requestAnimationFrame(animate);

time += 0.01;

computeAwareness();
updateNeurons();
updateSynapses();
updateBrain();
updateThoughts();

document.getElementById("activity").innerText =
 "Awareness: " + Math.floor(awareness * 100) + "%";

renderer.render(scene, camera);
}

// RESIZE
window.addEventListener("resize", () => {

camera.aspect = innerWidth / innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(innerWidth, innerHeight);

});
