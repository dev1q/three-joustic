import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Joustic } from './joustic';
import './style.css';

let width = window.innerWidth,
  height = window.innerHeight;

const size = 500;
const divisions = 30;

const renderer = new THREE.WebGLRenderer();

renderer.setSize(width, height);
document.getElementById('root').appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
camera.position.z = 50;
camera.position.y = 50;

const scene = new THREE.Scene();
scene.add(camera);

const light = new THREE.PointLight(0xffffff);
light.position.set(-100, 200, 100);
scene.add(light);

const controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = 100;
controls.minDistance = 100;
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = 0;
controls.autoRotate = false;
controls.autoRotateSpeed = 0;
controls.rotateSpeed = 0.4;
controls.enableDamping = false;
controls.dampingFactor = 0.1;
controls.enableZoom = false;
controls.enablePan = false;
controls.minAzimuthAngle = -Math.PI / 2;
controls.maxAzimuthAngle = Math.PI / 4;

const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

const size_floor = 100;
const geometry_floor = new THREE.BoxGeometry(size_floor, 1, size_floor);
const material_floor = new THREE.MeshNormalMaterial();

const floor = new THREE.Mesh(geometry_floor, material_floor);
floor.position.y = -5;

scene.add(floor);

function resize() {
  let w = window.innerWidth;
  let h = window.innerHeight;

  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

const joustic = new Joustic(scene, camera, controls);
const jousticElement = document.getElementById('joustic');
joustic.addJoystick(jousticElement);

function animate() {
  joustic.updatePlayer();
  renderer.render(scene, camera);
  controls.update();

  requestAnimationFrame(animate);
}

resize();
window.addEventListener('resize', resize);

animate();
