let scene, camera, renderer;

let brain;
let neurons = [];
let synapses = [];

let awareness = 0;
let time = 0;

let thoughts = [
 "processing reality...",
 "neural expansion...",
 "self simulation active...",
 "memory forming...",
 "pattern recognition...",
 "awareness rising...",
 "thinking about thinking..."
];

document.getElementById("start").onclick = () => {
 document.getElementById("start").remove();
 init();
};

function init() {

scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 40, 160);

camera = new THREE.PerspectiveCamera(70, innerWidth/innerHeight, 0.1, 1000);
camera.position.set(0,0,85);

renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

// 🧠 BRAIN
let geo = new THREE.IcosahedronGeometry(28, 5);
geo.center();

brain = new THREE.Mesh(
 geo,
 new THREE.MeshBasicMaterial({
  color:0x00ffff,
  wireframe:true,
  transparent:true,
  opacity:0.18
 })
);

scene.add(brain);

// 🔵 NEURONS
for (let i = 0; i < 240; i++) {

 let n = new THREE.Mesh(
  new THREE.SphereGeometry(0.45, 8, 8),
  new THREE.MeshBasicMaterial({ color:0x00ffff })
 );

 let phi = Math.random() * Math.PI;
 let theta = Math.random() * Math.PI * 2;
 let r = 25 + Math.random() * 15;

 n.position.set(
  r * Math.sin(phi) * Math.cos(theta),
  r * Math.sin(phi) * Math.sin(theta),
  r * Math.cos(phi)
 );

 n.pulse = Math.random() * 10;
 n.memory = Math.random();

 neurons.push(n);
 scene.add(n);
}

// 🔗 CONNECTIONS
for (let i = 0; i < 280; i++) createSynapse();

animate();
}

// 🔗 SYNAPSE SYSTEM
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
  color:0x0088ff,
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

// 🔥 BLOOM SAFE (FAKE GLOW SYSTEM)
function fakeGlow(material, intensity) {

let glow = Math.sin(time * 5) * 0.5 + 0.5;
material.opacity = 0.1 + glow * intensity;
}

// 🧠 UPDATE SYNAPSES
function updateSynapses() {

synapses.forEach((s, i) => {

 let a = neurons[s.a];
 let b = neurons[s.b];

 s.line.geometry.setFromPoints([
  a.position,
  b.position
 ]);

 s.life -= 0.0015;

 fakeGlow(s.line.material, 0.3);

 // reinforce connections
 if (Math.abs(a.memory - b.memory) < 0.25) {
  s.life += 0.01;
 }

 if (s.life <= 0) {
  scene.remove(s.line);
  synapses.splice(i, 1);
  createSynapse();
 }
});
}

// 🔵 NEURONS
function updateNeurons() {

neurons.forEach(n => {

 n.pulse += 0.03;

 let glow = Math.sin(n.pulse) * 0.5 + 0.5;

 n.material.color.setRGB(0, glow, 1);

 n.scale.setScalar(1 + glow * 0.45);

 n.position.x += Math.sin(time + n.memory) * 0.02;
 n.position.y += Math.cos(time + n.memory) * 0.02;
});
}

// 🧠 CONSCIOUSNESS
function computeAwareness() {

let sum = 0;

neurons.forEach(n => {
 sum += Math.abs(Math.sin(n.pulse));
});

awareness = sum / neurons.length;
}

// 💭 THOUGHT ENGINE
function updateThoughts() {

let i = Math.floor(awareness * thoughts.length);

document.getElementById("thought").innerText =
 "Thought: " + thoughts[i];
}

// 🧠 BRAIN BREATHING
function updateBrain() {

brain.rotation.y += 0.0015;

let breath = Math.sin(time * 0.7) * 0.04 + 1;

brain.scale.set(breath, breath, breath);
}

// 🚀 LOOP
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

camera.aspect = innerWidth/innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(innerWidth, innerHeight);

});
