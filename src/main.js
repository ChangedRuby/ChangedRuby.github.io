import './styles/style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import WebGL from 'three/addons/capabilities/WebGL.js';

var container, cameraT, cameraBg, renderer, textMesh;
var controls, controlsBg;
var sceneT, sceneBg;
var composerBg, renderPassBg, bokehPass, outputPassBg, composerT, renderPassT;

init();

function init(){
    container = document.querySelector('#canvas-container');
    sceneBg = new THREE.Scene();
    sceneT = new THREE.Scene({
        alpha: true
    });
    cameraT = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraBg = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    initMesh();
    initLight();

    Array(300).fill().forEach(initStar);
    
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    // Setup renderer
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.clientWidth, window.clientHeight);
    renderer.setScissorTest(true);
    renderer.autoClear = false;
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);

    // Move cameras
    cameraT.position.setY(0);
    cameraT.position.setZ(15);
    cameraBg.position.setZ(15);
    onWindowResize();

    // Load Cubemap
    const loader = new THREE.CubeTextureLoader();
    loader.setPath('./images/cubemap/');
    const cubemap = loader.load([
        'px.png',
        'nx.png',
        'py.png',
        'ny.png',
        'pz.png',
        'nz.png'
    ]);

    cubemap.magFilter = THREE.LinearFilter;
    cubemap.minFilter = THREE.LinearMipmapLinearFilter;
    cubemap.generateMipmaps = true;
    
    sceneBg.background = cubemap;
    
    // Setup PostProcessing
    initPostProcessing();


    // Setup controls
    controls = new OrbitControls(cameraT, renderer.domElement);
    controlsBg = new OrbitControls(cameraBg, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.1;
    controls.enablePan = false;
    controls.enableZoom = false;

    controlsBg.enableRotate = false;
    controlsBg.enablePan = false;
    controlsBg.enableZoom = false;
    controlsBg.autoRotate = true;
    controlsBg.autoRotateSpeed = 0.5;

    if ( WebGL.isWebGL2Available() ) {

        // Initiate animation
        renderer.setAnimationLoop( animate );
    
    } else {
    
        const warning = WebGL.getWebGL2ErrorMessage();
        document.getElementById( '.canvas-container' ).appendChild( warning );
    
    }
}

function initPostProcessing(){
    // Composer for sceneBg
    composerBg = new EffectComposer( renderer );
    renderPassBg = new RenderPass( sceneBg, cameraBg );
    composerBg.addPass( renderPassBg );

    bokehPass = new BokehPass( sceneBg, cameraBg , {
        focus: 1.0,
		aperture: 0.025,
		maxblur: 0.01
    });
    composerBg.addPass( bokehPass );

    outputPassBg = new OutputPass();
    composerBg.addPass( outputPassBg );

    // Composer for sceneT
    composerT = new EffectComposer( renderer );
    renderPassT = new RenderPass( sceneT, cameraT );
    composerT.addPass( renderPassT );
}

function initMesh(){
    const fontLoader = new FontLoader();
    var text;

    // Changes the text depending on the page
    if(window.location.pathname == '/index.html' || window.location.pathname == '/'){
        text = 'These are my projects';
    } else{
        text = 'About me';
    }

    fontLoader.load(
        './fonts/droid_serif_regular.typeface.json',
        (droidFont) => {
            const textGeometry = new TextGeometry(text, {
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
}

function initLight(){
    const ambientLight = new THREE.AmbientLight(0xffffff);
    const ambientLightBg = new THREE.AmbientLight(0xffffff);
    const pointLight = new THREE.PointLight(0xffffff);

    ambientLight.intensity = 2;
    pointLight.intensity = 10;
    pointLight.position.set(0, 0, 0);

    sceneT.add(ambientLight, pointLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff);

    sceneBg.add(hemisphereLight, ambientLightBg);
}

function initStar(){
    const star = new THREE.Mesh(
        new THREE.SphereGeometry(THREE.MathUtils.randFloat(0.1, 1), 4, 4),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
    )
  
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));
    
    star.position.set(x, y, z);
    sceneBg.add(star);
}

//const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(gridHelper);

function animate(){
    // Sets time to current date in milliseconds
    var time = Date.now();

    // Animates the mesh only when loaded
    if(textMesh != undefined){
        textMesh.rotation.y = Math.sin(time / 1000) * 0.4;
    }
    
    controls.update();
    controlsBg.update();

    var textContainer = document.querySelector('.projects-header');
    var rect = textContainer.getBoundingClientRect();

    var width = rect.right - rect.left;
    var height = rect.bottom - rect.top;
    var left = rect.left;
    var bottom = renderer.domElement.clientHeight - rect.bottom;

    // Renders sceneBg
    cameraBg.aspect = window.innerWidth / window.innerHeight;
    cameraBg.updateProjectionMatrix();
    renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    //renderer.render(sceneBg, cameraBg);
    composerBg.render();

    // Renders sceneT
    cameraT.aspect = width / height;
    cameraT.updateProjectionMatrix();
    renderer.setScissor(left, bottom, width, height);
    renderer.setViewport(left, bottom, width, height);
    //renderer.render(sceneT, cameraT);
    composerT.render();
}

function onWindowResize(){
    // resizes renderer to maintain square shape
    cameraT.aspect = window.innerWidth / window.innerHeight; // keeps square aspect ratio if 1
    cameraT.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
