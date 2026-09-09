console.log("CLEAN BRAIN LOADED");

// ========================
// 🧠 STATE LAYER
// ========================
const State = {
 awareness: 0,
 thought: "idle",
 mode: "init",
 error: null
};

// ========================
// 🧱 SAFE UI SYSTEM
// ========================
const UI = {
 root: null,
 elements: {},

 init() {
  this.root = document.getElementById("app");

  if (!this.root) {
    this.root = document.body;
  }

  this.create("panel", "div", "ui");
  this.create("title", "h2", "Neural Clean System");
  this.create("activity", "p", "Awareness: 0%");
  this.create("thought", "p", "Thought: idle");
 },

 create(id, tag, text) {
  const el = document.createElement(tag);
  el.id = id;
  el.innerText = text;
  this.root.appendChild(el);
  this.elements[id] = el;
 },

 set(id, text) {
  if (this.elements[id]) {
   this.elements[id].innerText = text;
  }
 }
};

// ========================
// 🧠 ENGINE LAYER
// ========================
const Engine = {

 scene: null,
 camera: null,
 renderer: null,
 brain: null,

 init3D() {

  if (!window.THREE) {
   console.warn("THREE missing → fallback mode");
   State.mode = "2D";
   return false;
  }

  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera(
   70,
   innerWidth / innerHeight,
   0.1,
   1000
  );

  this.camera.position.z = 80;

  this.renderer = new THREE.WebGLRenderer({ antialias:true });
  this.renderer.setSize(innerWidth, innerHeight);
  document.body.appendChild(this.renderer.domElement);

  const geo = new THREE.SphereGeometry(20, 20, 20);

  this.brain = new THREE.Mesh(
   geo,
   new THREE.MeshBasicMaterial({
    color:0x00ffff,
    wireframe:true
   })
  );

  this.scene.add(this.brain);

  return true;
 },

 update3D() {
  if (!this.brain) return;

  this.brain.rotation.y += 0.01;
  this.brain.rotation.x += 0.005;

  this.renderer.render(this.scene, this.camera);
 }
};

// ========================
// 🧠 THINK ENGINE
// ========================
const Mind = {

 thoughts: [
  "processing...",
  "learning environment...",
  "neural sync...",
  "pattern forming...",
  "awareness rising...",
  "self model active..."
 ],

 update() {

  State.awareness += 0.002;
  if (State.awareness > 1) State.awareness = 0;

  const i = Math.floor(State.awareness * this.thoughts.length);

  State.thought = this.thoughts[i] || "idle";
 }
};

// ========================
// 🚀 SAFE LOOP
// ========================
function loop() {

 try {

  Mind.update();

  UI.set("activity",
   "Awareness: " + Math.floor(State.awareness * 100) + "%"
  );

  UI.set("thought",
   "Thought: " + State.thought
  );

  if (State.mode === "3D") {
   Engine.update3D();
  }

 } catch (e) {
  console.error("SAFE CATCH:", e);
  State.error = e.message;
 }

 requestAnimationFrame(loop);
}

// ========================
// 🚀 BOOT SEQUENCE
// ========================
function boot() {

 UI.init();

 const ok = Engine.init3D();

 if (ok) State.mode = "3D";
 else State.mode = "2D";

 loop();
}

// ========================
// START
// ========================
window.addEventListener("load", boot);
