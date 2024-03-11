import '../css/style.css';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

//load texture

const loader = new THREE.TextureLoader();
const height = loader.load('./assets/Displacement_small.jpg');
const texture = loader.load('./assets/Combine.png');
const alpha = loader.load('./assets/alpha2.jpg');



// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
/* const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 ); */
const planeGeometry = new THREE.PlaneGeometry(10,10,64,64);

// Materials
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 'white',
    map: texture,
    displacementMap:height,
    displacementScale:2,
    alphaMap:alpha,
    transparent:true,
    depthTest:false,
    
});
/* const material = new THREE.MeshBasicMaterial()
material.color = new THREE.Color(0xff0000) */

// Mesh
const plane = new THREE.Mesh(planeGeometry,planeMaterial);
plane.rotation.x=4.71239;
plane.rotation.z=4.71239;
plane.position.y=-0.5;
plane.receiveShadow = true; 
//scene.add(plane);

/* const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere)
 */
// Lights

const pointLight = new THREE.PointLight(0xffffff, 8)
pointLight.position.x = 0
pointLight.position.y = 2
pointLight.position.z = 1
pointLight.castShadow=true
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})



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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 2
camera.position.y = 1.2
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
//controls.enableZoom=false
controls.enablePan=false
controls.maxPolarAngle = Math.PI / 2; // Change this value as needed

controls.maxDistance=2
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


///add model

const gloader = new GLTFLoader();
const dLoader = new DRACOLoader();
dLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
dLoader.setDecoderConfig({type: 'js'});
gloader.setDRACOLoader(dLoader);


let model;

gloader.load('./assets/map.glb', function(glb) {
    model = glb.scene;
     model.scale.set(0.009, 0.009, 0.009);
    model.position.y=-1
    scene.add(model);
    document.dispatchEvent(new CustomEvent('modelLoaded'));
});


document.addEventListener('modelLoaded', () => {
    
});

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
   // sphere.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()



// Sets a 12 by 12 gird helper
const gridHelper = new THREE.GridHelper(12, 12);
//scene.add(gridHelper);

// Sets the x, y, and z axes with each having a length of 4
const axesHelper = new THREE.AxesHelper(4);

//scene.add(axesHelper);

//GUI

gui.add(plane.rotation,'x').min(0).max(7);
gui.add(camera.position,'x')
gui.add(camera.position,'y')
gui.add(camera.position,'z')


gui.add(pointLight.position,'x');
gui.add(pointLight.position,'y');
gui.add(pointLight.position,'z');
gui.addColor(pointLight,'color');



//environment
scene.background = new THREE.Color(0x000621);


// Create a geometry for the upper half of the sphere
//const sphereGeometry = new THREE.SphereGeometry(20, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2); // Upper half
const sphereGeometry = new THREE.SphereGeometry(3, 32,32)
const edges = new THREE.EdgesGeometry(sphereGeometry); // Get edges

// Create a line material
const sphereMaterial = new THREE.LineBasicMaterial({ color: 0x213280 });

// Create line segments and add them to the scene
const lineSegments = new THREE.LineSegments(edges, sphereMaterial);
scene.add(lineSegments); 
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
//scene.add(sphere);
// Adding Fog (choose one of the two methods)
//scene.fog = new THREE.Fog(0x0000ff, 1, 10); // Linear Fog
 scene.fog = new THREE.FogExp2(0x0000ff, 0.2); // Exponential Fog
