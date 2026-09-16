import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js';

const host = document.querySelector('#three-canvas');
if (host) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
  camera.position.set(0, 0, 7);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  host.appendChild(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);
  const material = new THREE.MeshBasicMaterial({ color: 0xef6b43, wireframe: true, transparent: true, opacity: .72 });
  group.add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.8, 2), material));
  const dots = new THREE.Points(new THREE.SphereGeometry(2.5, 20, 14), new THREE.PointsMaterial({ color: 0xf4f1ea, size: .025 }));
  group.add(dots);
  let targetX = 0, targetY = 0;
  window.addEventListener('pointermove', (event) => { targetX = (event.clientX / innerWidth - .5) * .45; targetY = (event.clientY / innerHeight - .5) * .25; });
  function resize() { const { width, height } = host.getBoundingClientRect(); camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height); }
  addEventListener('resize', resize); resize();
  function render() { group.rotation.y += (targetX - group.rotation.y) * .025; group.rotation.x += (targetY - group.rotation.x) * .025; dots.rotation.y -= .0015; renderer.render(scene, camera); requestAnimationFrame(render); }
  render();
}
