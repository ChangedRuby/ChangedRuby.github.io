import './styles/style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import WebGL from 'three/addons/capabilities/WebGL.js';

const container = document.querySelector('#canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  alpha: true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);
camera.position.setY(0);
camera.position.setZ(15);
onWindowResize();

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(10, 3, 16, 100),
    new THREE.MeshStandardMaterial({ color: 0xffff00 }),
);
torus.position.set(0, 5, 0);

var textMesh;
const fontLoader = new FontLoader();
fontLoader.load(
    './fonts/droid_serif_regular.typeface.json',
    (droidFont) => {
        const textGeometry = new TextGeometry('Some of my projects', {
            height: 1,
            depth: 0.05,
            size: 1,
            font: droidFont,
        });
        const textMaterial = new THREE.MeshStandardMaterial();
        textMesh = new THREE.Mesh(textGeometry, textMaterial);

        // center the text geometry
        textGeometry.computeBoundingBox();
        const center = textGeometry.boundingBox.getCenter(new THREE.Vector3());

        textMesh.updateMatrixWorld();
        center.applyMatrix4(textMesh.matrixWorld);
        textGeometry.translate(-center.x, -center.y, -center.z);

        textMesh.position.x = 0;
        textMesh.position.y = 0;
        scene.add(textMesh);
    }
);

const ambientLight = new THREE.AmbientLight(0xffffff);
const pointLight = new THREE.PointLight(0xffffff);
ambientLight.intensity = 2;
pointLight.intensity = 10;
pointLight.position.set(0, 0, 0);
scene.add(ambientLight, pointLight);

// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.enablePan = false;

const startDate = Date.now();

function animate(){
    requestAnimationFrame(animate);

    var currentDate = Date.now();
    var milliseconds = currentDate - startDate;

    if(textMesh != undefined){
        textMesh.rotation.y = Math.sin(milliseconds / 1000) * 0.4;
    }
    
    controls.update();

    renderer.render(scene, camera);
}

// resize renderer to maintain square shape
function onWindowResize(){
    // const size = Math.min(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight; // keeps square aspect ratio if 1
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener('resize', onWindowResize);

if ( WebGL.isWebGL2Available() ) {

	// Initiate function or other initializations here
	animate();

} else {

	const warning = WebGL.getWebGL2ErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}