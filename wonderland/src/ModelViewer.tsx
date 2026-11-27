import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Bounds, ContactShadows, OrbitControls, useGLTF } from '@react-three/drei'
import { assetUrl } from './assets'

const MODEL = assetUrl('/models/brine-stance.glb')

function Stance() {
  const { scene } = useGLTF(MODEL)
  return <primitive object={scene} />
}

useGLTF.preload(MODEL)

export default function ModelViewer() {
  const [dragging, setDragging] = useState(false)

  return (
    <div
      className={`bv ${dragging ? 'is-dragging' : ''}`}
      onPointerDown={() => setDragging(true)}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <Canvas camera={{ position: [0, 0.2, 3], fov: 38 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.72} />
        <directionalLight position={[3, 4, 4]} intensity={1.9} />
        <directionalLight position={[-2.5, 1.5, -3]} intensity={1.1} color="#8fd8c2" />
        <directionalLight position={[0, -1.5, 2]} intensity={0.35} color="#f3a8c0" />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.12}>
            <Stance />
          </Bounds>
        </Suspense>
        <ContactShadows position={[0, -1.05, 0]} opacity={0.24} scale={6} blur={2.6} far={2.4} />
        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.9}
          minPolarAngle={Math.PI / 3.2}
          maxPolarAngle={Math.PI / 1.72}
        />
      </Canvas>
      <span className="bv-hint">拖动 · 旋转</span>
    </div>
  )
}
