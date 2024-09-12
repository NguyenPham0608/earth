import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

import getStarfield from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
// THREE.ColorManagement.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
const FS=true

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping=true
controls.DampFactor=0.03
const detail = 1;
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshPhongMaterial({
  map: loader.load("./textures/earthmap1k.jpg"),
  specularMap: loader.load("./textures/earthspec1k.jpg"),
  bumpMap: loader.load("./textures/earthbump1k.jpg"),
  bumpScale: 0.04,
  flatShading:FS
});
// material.map.colorSpace = THREE.SRGBColorSpace;
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const wireMat=new THREE.MeshBasicMaterial({color:0xffffff, wireframe:true})
const wireMesh=new THREE.Mesh(geometry, wireMat)
wireMesh.scale.setScalar(1.001)
earthGroup.add(wireMesh)


const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load("./textures/earthlights1k.jpg"),
  blending: THREE.AdditiveBlending,
  flatShading:FS

});
const lightsMesh = new THREE.Mesh(geometry, lightsMat);
earthGroup.add(lightsMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/earthcloudmap.jpg"),
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  alphaMap: loader.load('./textures/earthcloudmaptrans.jpg'),
  // alphaTest: 0.3,
  flatShading:FS

});
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
earthGroup.add(cloudsMesh);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);

const stars = getStarfield({numStars: 2000});
scene.add(stars);

const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);



earthGroup.scale.setScalar(2.5)


function animate() {
  requestAnimationFrame(animate);

  earthMesh.rotation.y += 0.002;
  lightsMesh.rotation.y += 0.002;
  cloudsMesh.rotation.y += 0.002;
  glowMesh.rotation.y += 0.002;
  wireMesh.rotation.y += 0.002;
  stars.rotation.y -= 0.0002;
  controls.update()
  renderer.render(scene, camera);
}

animate();

function handleWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}


window.addEventListener('resize', handleWindowResize, false);
window.addEventListener("wheel", function(e){
  earthGroup.scale.x+=0.01
  earthGroup.scale.y+=0.01
  earthGroup.scale.z+=0.01
})
