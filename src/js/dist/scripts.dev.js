"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

require("../css/style.css");

var THREE = _interopRequireWildcard(require("three"));

var _OrbitControls = require("three/examples/jsm/controls/OrbitControls.js");

var dat = _interopRequireWildcard(require("dat.gui"));

var _EffectComposer = require("three/examples/jsm/postprocessing/EffectComposer.js");

var _RenderPass = require("three/examples/jsm/postprocessing/RenderPass.js");

var _UnrealBloomPass = require("three/examples/jsm/postprocessing/UnrealBloomPass.js");

var _GLTFLoader = require("three/examples/jsm/loaders/GLTFLoader");

var _DRACOLoader = require("three/examples/jsm/loaders/DRACOLoader");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(); //load texture

var loader = new THREE.TextureLoader();
var height = loader.load('./assets/Displacement_small.jpg');
var texture = loader.load('./assets/Combine.png');
var alpha = loader.load('./assets/alpha2.jpg'); // Debug

var gui = new dat.GUI(); // Canvas

var canvas = document.querySelector('canvas.webgl'); // Scene

var scene = new THREE.Scene(); // Objects

/* const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 ); */

var planeGeometry = new THREE.PlaneGeometry(10, 10, 64, 64); // Materials

var planeMaterial = new THREE.MeshStandardMaterial({
  color: 'white',
  map: texture,
  displacementMap: height,
  displacementScale: 2,
  alphaMap: alpha,
  transparent: true,
  depthTest: false
});
/* const material = new THREE.MeshBasicMaterial()
material.color = new THREE.Color(0xff0000) */
// Mesh

var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = 4.71239;
plane.rotation.z = 4.71239;
plane.position.y = -0.5;
plane.receiveShadow = true; //scene.add(plane);

/* const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere)
 */
// Lights

var pointLight = new THREE.PointLight(0xffffff, 8);
pointLight.position.x = 0;
pointLight.position.y = 2;
pointLight.position.z = 1;
pointLight.castShadow = true;
scene.add(pointLight);
/**
 * Sizes
 */

var sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};
window.addEventListener('resize', function () {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight; // Update camera

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix(); // Update renderer

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
/* // Load and set the environment map (cubemap)
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMap = cubeTextureLoader.load([
    './assets/pos-x.jpg', './assets/neg-x.jpg',
    './assets/pos-y.jpg', './assets/neg-y.jpg',
    './assets/pos-z.jpg', './assets/neg-z.jpg'
]);
scene.background = environmentMap; // Set as background (optional) */
// Load equirectangular image and set as environment map

/* const textureLoader = new THREE.TextureLoader();
textureLoader.load('./assets/env (2).jpg', function(texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture; // Set as background (optional)
    scene.environment = texture; // Set as environment map
});
 */

/**
 * Camera
 */
// Base camera

var camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 2;
camera.position.y = 1.2;
camera.position.z = 2;
scene.add(camera); // Controls

var controls = new _OrbitControls.OrbitControls(camera, canvas);
controls.enableDamping = true; //controls.enableZoom=false

controls.enablePan = false;
controls.maxPolarAngle = Math.PI / 2; // Change this value as needed

controls.maxDistance = 2;
/**
 * Renderer
 */

var renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); ///add model

var gloader = new _GLTFLoader.GLTFLoader();
var dLoader = new _DRACOLoader.DRACOLoader();
dLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
dLoader.setDecoderConfig({
  type: 'js'
});
gloader.setDRACOLoader(dLoader);
var model;
gloader.load('./assets/map.glb', function (glb) {
  model = glb.scene;
  model.scale.set(0.009, 0.009, 0.009);
  model.position.y = -1;
  scene.add(model);
  document.dispatchEvent(new CustomEvent('modelLoaded'));
});
document.addEventListener('modelLoaded', function () {});
/**
 * Animate
 */

var clock = new THREE.Clock();

var tick = function tick() {
  var elapsedTime = clock.getElapsedTime(); // Update objects
  // sphere.rotation.y = .5 * elapsedTime
  // Update Orbital Controls
  // controls.update()
  // Render

  renderer.render(scene, camera); // Call tick again on the next frame

  window.requestAnimationFrame(tick);
};

tick(); // Sets a 12 by 12 gird helper

var gridHelper = new THREE.GridHelper(12, 12); //scene.add(gridHelper);
// Sets the x, y, and z axes with each having a length of 4

var axesHelper = new THREE.AxesHelper(4); //scene.add(axesHelper);
//GUI

gui.add(plane.rotation, 'x').min(0).max(7);
gui.add(camera.position, 'x');
gui.add(camera.position, 'y');
gui.add(camera.position, 'z');
gui.add(pointLight.position, 'x');
gui.add(pointLight.position, 'y');
gui.add(pointLight.position, 'z');
gui.addColor(pointLight, 'color'); //environment

scene.background = new THREE.Color(0x000621); // Create a geometry for the upper half of the sphere
//const sphereGeometry = new THREE.SphereGeometry(20, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2); // Upper half

var sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
var edges = new THREE.EdgesGeometry(sphereGeometry); // Get edges
// Create a line material

var sphereMaterial = new THREE.LineBasicMaterial({
  color: 0x213280
}); // Create line segments and add them to the scene

var lineSegments = new THREE.LineSegments(edges, sphereMaterial);
scene.add(lineSegments);
var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial); //scene.add(sphere);
// Adding Fog (choose one of the two methods)
//scene.fog = new THREE.Fog(0x0000ff, 1, 10); // Linear Fog

scene.fog = new THREE.FogExp2(0x0000ff, 0.2); // Exponential Fog
//# sourceMappingURL=scripts.dev.js.map
