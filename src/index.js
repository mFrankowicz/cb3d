import * as THREE from 'three'

import Stats from 'three/examples/jsm/libs/stats.module'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment'
import glb from '../scene/cmd_lud.glb'

let mixer;

let open_action;

const clock = new THREE.Clock();
const container = document.getElementById( 'app' );

const stats = new Stats();
container.appendChild( stats.domElement );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild( renderer.domElement );

const pmremGenerator = new THREE.PMREMGenerator( renderer );

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xbfe3dd );
scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;

const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, .01, 100 );
camera.position.set( 5, 2, 8 );

const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 0.5, 0 );
controls.update();
controls.enablePan = true;
controls.enableDamping = true;

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( '../scene/' );

const loader = new GLTFLoader();
loader.setDRACOLoader( dracoLoader );

document.addEventListener('pointerdown', onPointerDown);


loader.load( glb, function ( gltf ) {
  gltf = gltf
  const model = gltf.scene;
  model.position.set( 0, 0, 0 );
  //model.scale.set( 0.01, 0.01, 0.01 );
  scene.add( model );

  mixer = new THREE.AnimationMixer( model );
  
  open_action = mixer.clipAction(gltf.animations[0]);
//   mixer.clipAction( gltf.animations[ 1 ] ).play();

  mixer.addEventListener('finished', function(e) {
    console.log("finished")
    open_action.stop();
  });

  animate();

}, undefined, function ( e ) {

  console.error( e );

} );

function onPointerDown(event) {
  open_action.loop = THREE.LoopOnce;
  open_action.play();
}

window.onresize = function () {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

};


function animate() {

  requestAnimationFrame( animate );

  const delta = clock.getDelta();

  mixer.update( delta );

  controls.update();

  stats.update();

  renderer.render( scene, camera );

}
