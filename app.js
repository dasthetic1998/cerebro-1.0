let scene, camera, renderer, composer;
let brain, neurons=[], connections=[], particles;

let analyser, dataArray;

// INIT
document.getElementById("start").onclick = async ()=>{
 document.getElementById("start").remove();
 init();
};

// 🔥 INIT
async function init(){

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
camera.position.z = 80;

renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// ✨ BLOOM
composer = new THREE.EffectComposer(renderer);
composer.addPass(new THREE.RenderPass(scene, camera));

let bloom = new THREE.UnrealBloomPass(
 new THREE.Vector2(innerWidth, innerHeight),
 1.5, 0.4, 0.85
);
composer.addPass(bloom);

// 🧠 CEREBRO
let geo = new THREE.IcosahedronGeometry(20,5);
let pos = geo.attributes.position;

for(let i=0;i<pos.count;i++){
 let x = pos.getX(i);
 let y = pos.getY(i);
 let z = pos.getZ(i);

 let n = Math.sin(x*0.3)*Math.cos(y*0.3);
 pos.setXYZ(i, x*(1+n*0.2), y*(1+n*0.1), z);
}

brain = new THREE.Mesh(
 geo,
 new THREE.MeshBasicMaterial({
  color:0x0a0aff,
  wireframe:true,
  transparent:true,
  opacity:0.2
 })
);

scene.add(brain);

// 🔵 NEURONAS
for(let i=0;i<250;i++){
 let n = new THREE.Mesh(
  new THREE.SphereGeometry(0.4,8,8),
  new THREE.MeshBasicMaterial({color:0x00ffff})
 );

 let phi = Math.random()*Math.PI;
 let theta = Math.random()*Math.PI*2;
 let r = 18 + Math.random()*4;

 n.position.set(
  r*Math.sin(phi)*Math.cos(theta),
  r*Math.sin(phi)*Math.sin(theta),
  r*Math.cos(phi)
 );

 n.activity = Math.random();
 neurons.push(n);
 scene.add(n);
}

// 🔗 CONEXIONES
function connect(a,b){
 let geo = new THREE.BufferGeometry().setFromPoints([
  neurons[a].position,
  neurons[b].position
 ]);

 let line = new THREE.Line(
  geo,
  new THREE.LineBasicMaterial({color:0x3399ff, transparent:true})
 );

 connections.push({a,b,line,pulse:Math.random()});
 scene.add(line);
}

for(let i=0;i<400;i++){
 connect(
  Math.floor(Math.random()*neurons.length),
  Math.floor(Math.random()*neurons.length)
 );
}

// 🌫 PARTÍCULAS
let pGeo = new THREE.BufferGeometry();
let count = 800;
let arr = new Float32Array(count*3);

for(let i=0;i<count;i++){
 arr[i*3] = (Math.random()-0.5)*40;
 arr[i*3+1] = (Math.random()-0.5)*40;
 arr[i*3+2] = (Math.random()-0.5)*40;
}

pGeo.setAttribute("position", new THREE.BufferAttribute(arr,3));

particles = new THREE.Points(
 pGeo,
 new THREE.PointsMaterial({color:0x00ffff,size:0.3})
);

scene.add(particles);

// 🎤 MICRO
let audioCtx = new (window.AudioContext||window.webkitAudioContext)();
let stream = await navigator.mediaDevices.getUserMedia({audio:true});

let src = audioCtx.createMediaStreamSource(stream);

analyser = audioCtx.createAnalyser();
analyser.fftSize = 128;
dataArray = new Uint8Array(analyser.frequencyBinCount);

src.connect(analyser);

document.getElementById("mic").innerText = "ON";

// 🚀 LOOP
animate();
}

// LOOP
function animate(){
 requestAnimationFrame(animate);

 analyser.getByteFrequencyData(dataArray);

 let energy = dataArray.reduce((a,b)=>a+b,0)/dataArray.length;

 // neuronas
 neurons.forEach(n=>{
  n.activity += energy*0.0002;
  n.activity *= 0.96;
  n.material.color.setRGB(n.activity,0.5,1);
 });

 // conexiones
 connections.forEach(c=>{
  c.pulse += 0.02 + energy*0.0001;
  let glow = Math.sin(c.pulse)*0.5+0.5;
  c.line.material.opacity = glow;
 });

 // partículas
 let pos = particles.geometry.attributes.position.array;
 for(let i=0;i<pos.length;i+=3){
  pos[i+1] += Math.sin(Date.now()*0.001+i)*0.01;
 }
 particles.geometry.attributes.position.needsUpdate = true;

 brain.rotation.y += 0.002;

 document.getElementById("activity").innerText =
  "Actividad: " + Math.floor(energy/255*100) + "%";

 composer.render();
}

// resize
addEventListener("resize",()=>{
 camera.aspect = innerWidth/innerHeight;
 camera.updateProjectionMatrix();
 renderer.setSize(innerWidth, innerHeight);
});
