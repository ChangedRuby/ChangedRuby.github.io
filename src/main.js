import './styles/style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import WebGL from 'three/addons/capabilities/WebGL.js';

init();

var container, camera, cameraBg, renderer;
var innerContainer;
var sceneT, sceneBg;
var textMesh;

function init(){
    container = document.querySelector('#canvas-container');
    sceneBg = new THREE.Scene();
    sceneT = new THREE.Scene({
        alpha: true
    });
    camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraBg = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    initMesh();
    initLight();
    
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.clientWidth, window.clientHeight);
    renderer.setScissorTest(true);
    renderer.setAnimationLoop( animate );
    container.appendChild(renderer.domElement);
    
    sceneBg.background = new THREE.TextureLoader().load('images/space.jpg');
    camera.position.setY(0);
    camera.position.setZ(15);
    cameraBg.position.setZ(15);
    onWindowResize();
}

function initMesh(){
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
            sceneT.add(textMesh);
        }
    );

    const cube = new THREE.Mesh(
        new THREE.TorusGeometry(10, 3, 16, 100),
        new THREE.MeshStandardMaterial({ color: 0xFF6347 })
      );
      
    sceneBg.add(cube);
}

function initLight(){
    const ambientLight = new THREE.AmbientLight(0xffffff);
    const pointLight = new THREE.PointLight(0xffffff);
    ambientLight.intensity = 2;
    pointLight.intensity = 10;
    pointLight.position.set(0, 0, 0);
    sceneT.add(ambientLight, pointLight);

    const hemisphere = new THREE.HemisphereLight(0xffffff);
    sceneBg.add(hemisphere);
}

// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);
const controlsBg = new OrbitControls(cameraBg, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.rotateSpeed = 0.1;
controls.enablePan = false;
controls.enableZoom = false;
controlsBg.enableZoom = false;
controlsBg.autoRotate = true;

const startDate = Date.now();

function animate(){

    var currentDate = Date.now();
    var milliseconds = currentDate - startDate;

    if(textMesh != undefined){
        textMesh.rotation.y = Math.sin(milliseconds / 1000) * 0.4;
    }
    
    controls.update();
    controlsBg.update();

    var textContainer = document.querySelector('.projects-header');
    var rect = textContainer.getBoundingClientRect();

    var width = rect.right - rect.left;
    var height = rect.bottom - rect.top;
    var left = rect.left;
    var bottom = renderer.domElement.clientHeight - rect.bottom;

    cameraBg.aspect = window.innerWidth / window.innerHeight;
    cameraBg.updateProjectionMatrix();
    renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.render(sceneBg, cameraBg);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setScissor(left, bottom, width, height);
    renderer.setViewport(left, bottom, width, height);
    renderer.render(sceneT, camera);
}

// resize renderer to maintain square shape
function onWindowResize(){
    // const size = Math.min(container.clientWidth, container.clientHeight);
    camera.aspect = window.innerWidth / window.innerHeight; // keeps square aspect ratio if 1
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);

if ( WebGL.isWebGL2Available() ) {

	// Initiate function or other initializations here
	animate();

} else {

	const warning = WebGL.getWebGL2ErrorMessage();
	document.getElementById( '.canvas-container' ).appendChild( warning );

}