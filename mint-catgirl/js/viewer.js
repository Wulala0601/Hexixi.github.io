import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/loaders/GLTFLoader.js';

document.querySelectorAll('.three-viewer[data-model]').forEach(createViewer);

function createViewer(host) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  host.replaceChildren(renderer.domElement);
  const root = new THREE.Group(); scene.add(root);
  scene.add(new THREE.AmbientLight(0xffffff, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(4, 6, 5); scene.add(key);
  const mint = new THREE.DirectionalLight(0xa8ffd8, 2); mint.position.set(-5, 2, 3); scene.add(mint);
  let model, radius = 1, yaw = 0, pitch = 0, distance = 5, drag = null;
  const resize = () => { const r = host.getBoundingClientRect(); camera.aspect = r.width / r.height; camera.updateProjectionMatrix(); renderer.setSize(r.width, r.height, false); };
  new ResizeObserver(resize).observe(host); resize();
  const fallback = (message) => { const note = document.createElement('div'); note.className = 'viewer-fallback'; note.innerHTML = `<span>✦</span>${message}`; host.append(note); };
  new GLTFLoader().load(host.dataset.model, (gltf) => {
    model = gltf.scene; root.add(model);
    const box = new THREE.Box3().setFromObject(model); const size = box.getSize(new THREE.Vector3()); const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center); radius = Math.max(size.x, size.y, size.z) / 2 || 1;
    distance = radius / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 1.5; camera.near = Math.max(.01, distance / 100); camera.far = distance * 100; camera.updateProjectionMatrix();
  }, undefined, () => fallback(`${host.dataset.modelName || '模型'}暂未放入 models 文件夹`));
  host.addEventListener('pointerdown', e => { drag = { x:e.clientX, y:e.clientY }; host.setPointerCapture(e.pointerId); });
  host.addEventListener('pointermove', e => {
    if (drag) {
      yaw += (e.clientX - drag.x) * .012;
      pitch = THREE.MathUtils.clamp(pitch + (e.clientY - drag.y) * .009, -.6, .6);
      drag = { x:e.clientX, y:e.clientY };
      return;
    }
    // 首页模型跟随鼠标横向位置：从左到右覆盖完整 360°。
    if (host.id === 'hub-viewer') yaw = (e.offsetX / host.clientWidth) * Math.PI * 2;
  });
  host.addEventListener('pointerup', () => { drag = null; }); host.addEventListener('pointercancel', () => { drag = null; });
  host.addEventListener('wheel', e => { e.preventDefault(); distance = THREE.MathUtils.clamp(distance + e.deltaY * radius * .002, radius * 1.2, radius * 6); }, { passive:false });
  function frame() { if (model && !drag) yaw += .003; root.rotation.set(pitch, yaw, 0); camera.position.set(0, 0, distance); camera.lookAt(0,0,0); renderer.render(scene, camera); requestAnimationFrame(frame); } frame();
}
