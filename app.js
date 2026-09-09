let scene, camera, renderer;
let brain;

let safeMode = false;
let frame = 0;

// 🚨 SAFE INIT
document.getElementById("start").onclick = () => {
 document.getElementById("start").remove();
 boot();
};

function boot() {

try {

 if (!window.THREE) throw new Error("Three.js not loaded");

 init3D();
 animate();

 document.getElementById("status").innerText = "Status: ONLINE (3D MODE)";

} catch (e) {

 console.warn("SAFE MODE ACTIVATED:", e);

 safeMode = true;
 initFallback();

 document.getElementById("status").innerText = "Status: SAFE MODE (2D fallback)";
}
}

// 🧠 3D MODE
function init3D() {

scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

camera = new THREE.PerspectiveCamera(70, innerWidth/innerHeight, 0.1, 1000);
camera.position.set(0,0,70);

renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

// 🧠 brain safe
let geo = new THREE.IcosahedronGeometry(25, 4);
geo.center();

brain = new THREE.Mesh(
 geo,
 new THREE.MeshBasicMaterial({
  color:0x00ffff,
  wireframe:true,
  opacity:0.4,
  transparent:true
 })
);

scene.add(brain);
}

// 🌑 FALLBACK MODE (NO THREE NEEDED)
function initFallback() {

const c = document.getElementById("fallback");
const ctx = c.getContext("2d");

function resize(){
 c.width = innerWidth;
 c.height = innerHeight;
}
resize();
window.addEventListener("resize", resize);

function loop(){

frame++;

ctx.fillStyle = "black";
ctx.fillRect(0,0,c.width,c.height);

let cx = c.width/2;
let cy = c.height/2;

for(let i=0;i<80;i++){

 let angle = i * 0.1 + frame*0.02;
 let x = cx + Math.cos(angle)*120;
 let y = cy + Math.sin(angle)*120;

 ctx.strokeStyle = "rgba(0,255,255,0.6)";
 ctx.beginPath();
 ctx.arc(x,y,2,0,Math.PI*2);
 ctx.stroke();
}

requestAnimationFrame(loop);
}

loop();
}

// 🚀 ANIMATE 3D
function animate(){

if(safeMode) return;

requestAnimationFrame(animate);

frame++;

brain.rotation.y += 0.002;
brain.rotation.x += 0.001;

document.getElementById("status").innerText =
 "Status: ACTIVE | frame " + frame;

renderer.render(scene,camera);
}

// resize safe
window.addEventListener("resize", () => {

if(!renderer) return;

camera.aspect = innerWidth/innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(innerWidth, innerHeight);

});
