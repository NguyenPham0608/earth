import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import getStarField from "./src/getStarfield.js"


const w=window.innerWidth
const h=window.innerHeight
const scene=new THREE.Scene()
const camera=new THREE.PerspectiveCamera(75, w/h, 0.1, 1000)
camera.position.z=5
const renderer=new THREE.WebGLRenderer({antialias: true})
renderer.setSize(w,h)
document.body.appendChild(renderer.domElement)

const earthGroup=new THREE.Group()
scene.add(earthGroup)
earthGroup.rotation.z=-23.4*Math.PI/180
const controls=new OrbitControls(camera, renderer.domElement)
controls.enableDamping=true
controls.DampingFactor=0.03
const detail=15
const loader=new THREE.TextureLoader()
const geometry=new THREE.IcosahedronGeometry(1,detail)
const material=new THREE.MeshStandardMaterial({
  map: loader.load("./textures/00_earthmap1k.jpg")
})
const earthMesh=new THREE.Mesh(geometry, material)
earthGroup.add(earthMesh)


const lightsMat= new THREE.MeshBasicMaterial({
  // color:0x00ff00,
  // transparent:true,
  // opacity:0.6
  map:loader.load("./textures/03_earthlights1k.jpg"),
  blending:THREE.AdditiveBlending,
})
const lightMesh=new THREE.Mesh(geometry, lightsMat)
earthGroup.add(lightMesh)

const cloudMat=new THREE.MeshStandardMaterial({
  // map:loader.load("./textures/05_earthcloudmaptrans.jpg"),
  // transparent:true,
  // opacity:0.8,
  blending:THREE.AdditiveBlending,
})
const cloudMesh=new THREE.Mesh(geometry, cloudMat)
cloudMesh.scale.setScalar(1.005)
// earthGroup.add(cloudMesh)
const stars=getStarField({numStars:3500})
scene.add(stars)

earthGroup.scale.setScalar(2)

// const hemiLight=new THREE.HemisphereLight(0xffffff, 0xffffff)
// scene.add(hemiLight)

const sunLight=new THREE.DirectionalLight(0xc9c9c9)
sunLight.position.set(-2,0.5, 1.5)
scene.add(sunLight)
function animate(){
  requestAnimationFrame(animate)

  earthMesh.rotation.y+=0.002
  lightMesh.rotation.y+=0.002
  cloudMesh.rotation.y+=0.002
  controls.update()

  renderer.render(scene,camera)
}

animate()