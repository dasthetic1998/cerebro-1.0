console.log("ZERO BUILD LOADED");

let scene, camera, renderer;
let brain;
let fallbackMode = false;

window.addEventListener("load", () => {

const btn = document.getElementById("start");

if (!btn) {
 console.error("NO START BUTTON");
 return;
}

btn.onclick = () => {
 btn.remove();
 boot();
};

});

function boot() {

try {

 if (!window.THREE) throw new Error("THREE NOT LOADED");

 init3D();
 animate();

 document.getElementById("status").innerText = "Status: 3D ACTIVE";

} catch (e) {

 console.warn("FALLBACK MODE:", e);

 fallbackMode = true;
 init2D();

 document.getElementById("status").innerText = "Status: 2D SAFE MODE";
}
}

/* -----------------------------
   🧠 3D MODE (SAFE MINIMAL)
------------------------------*/

function init3D() {

scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

camera = new THREE.PerspectiveCamera(
 70,
 innerWidth / innerHeight,
 0.1,
 1000
);

camera.position.set(0,0,70);

renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// 🧠 SIMPLE BRAIN (NO ERRORS POSSIBLE)
const geo = new THREE.SphereGeometry(20, 16, 16);

brain = new THREE.Mesh(
 geo,
 new THREE.MeshBasicMaterial({
  color:0x00ffff,
  wireframe:true
 })
);

scene.add(brain);
}

/* -----------------------------
   🌑 2D FALLBACK MODE
------------------------------*/

function init2D() {

const c = document.getElementById("fallback");
const ctx = c.getContext("2d");

function resize(){
 c.width = innerWidth;
 c.height = innerHeight;
}
resize();
window.addEventListener("resize", resize);

let t = 0;

function loop(){

t++;

ctx.fillStyle = "black";
ctx.fillRect(0,0,c.width,c.height);

let cx = c.width/2;
let cy = c.height/2;

// animated neural ring
for(let i=0;i<100;i++){

 let a = i * 0.1 + t * 0.02;
 let x = cx + Math.cos(a) * 140;
 let y = cy + Math.sin(a) * 140;

 ctx.strokeStyle = "rgba(0,255,255,0.5)";
 ctx.beginPath();
 ctx.arc(x,y,2,0,Math.PI*2);
 ctx.stroke();
}

requestAnimationFrame(loop);
}

loop();
}

/* -----------------------------
   🚀 RENDER LOOP
------------------------------*/

function animate() {

if (fallbackMode) return;

requestAnimationFrame(animate);

if (!brain) return;

brain.rotation.y += 0.01;
brain.rotation.x += 0.005;

renderer.render(scene, camera);
}

/* -----------------------------
   📏 RESIZE SAFE
------------------------------*/

window.addEventListener("resize", () => {

if (!renderer || !camera) return;

camera.aspect = innerWidth / innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(innerWidth, innerHeight);

});
