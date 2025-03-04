import './styles/style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import WebGL from 'three/addons/capabilities/WebGL.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.clientWidth, window.clientHeight);
camera.position.setY(5);
camera.position.setZ(30);

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(10, 3, 16, 100),
    new THREE.MeshStandardMaterial({ color: 0xffff00 }),
);
torus.position.set(0, 5, 0);
scene.add(torus);

const ambientLight = new THREE.AmbientLight(0xffffff);
const pointLight = new THREE.PointLight(0xffffff);
ambientLight.intensity = 2;
pointLight.intensity = 10;
pointLight.position.set(0, 0, 0);
scene.add(ambientLight, pointLight);

const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;

function animate(){
    requestAnimationFrame(animate);

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;
    
    controls.update();

    renderer.render(scene, camera);
}

// resize renderer to maintain square shape
function onWindowResize(){
    const size = Math.min(window.clientWidth, window.clientHeight);
    camera.updateProjectionMatrix();
    renderer.setSize(size, size);
}

window.addEventListener('resize', onWindowResize);

if ( WebGL.isWebGL2Available() ) {

	// Initiate function or other initializations here
	animate();
    onWindowResize();

} else {

	const warning = WebGL.getWebGL2ErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}