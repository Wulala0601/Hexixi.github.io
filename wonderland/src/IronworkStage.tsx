import { assetUrl } from './assets'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

function ReferenceFence() {
  const texture = useTexture(assetUrl('/images/user-iron-fence.png'), map => {
    map.colorSpace = THREE.SRGBColorSpace
  })
  // Preserve the supplied image's proportions and transparent cutouts. Its
  // visible bottom edge meets the pedestal after allowing for the PNG padding.
  return <mesh position={[0, .25, -.52]}>
    <planeGeometry args={[3.5, 3.5 * 1080 / 843]}/>
    <meshBasicMaterial map={texture} transparent alphaTest={.01} depthWrite={false} toneMapped={false} side={THREE.DoubleSide}/>
  </mesh>
}


const TAU = Math.PI * 2
const polar = (radius: number, angle: number, y: number) => new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius)

function laceGeometry() {
  const ivory: THREE.BufferGeometry[] = []
  const rose: THREE.BufferGeometry[] = []
  const thread = (list: THREE.BufferGeometry[], points: THREE.Vector3[], thickness = .012, closed = true) => {
    list.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points, closed), points.length * 2, thickness, 5, closed))
  }
  // Continuous paired threads form a braided rim rather than a solid metal band.
  for (const y of [-1.765, -1.84, -2.18]) {
    for (const phase of [0, Math.PI]) {
      thread(phase ? rose : ivory, Array.from({ length: 192 }, (_, j) => {
        const a = j / 192 * TAU
        return polar(1.79 + Math.cos(a * 48 + phase) * .016, a, y + Math.sin(a * 48 + phase) * .013)
      }), .01)
    }
  }
  for (let i = 0; i < 32; i++) {
    const a = i / 32 * TAU
    // Open petal eyelets lie flat around the satin platform.
    thread(ivory, Array.from({ length: 24 }, (_, j) => {
      const t = j / 24 * TAU
      return polar(1.68 + .235 * Math.cos(t), a + .065 * Math.sin(t), -1.748)
    }), .012)
    thread(rose, Array.from({ length: 20 }, (_, j) => {
      const t = j / 20 * TAU
      return polar(1.68 + .165 * Math.cos(t), a + .038 * Math.sin(t), -1.744)
    }), .008)
    // Fine teardrop embroidery hangs around the open cylindrical apron.
    for (const side of [-1, 1]) {
      thread(ivory, Array.from({ length: 24 }, (_, j) => {
        const t = j / 24 * TAU
        return polar(1.79, a + side * .036 + .033 * Math.sin(t), -1.85 - .145 * (1 - Math.cos(t)))
      }), .011)
    }
    // A scalloped hem and tiny picot loops give the lace a soft finished edge.
    thread(ivory, Array.from({ length: 20 }, (_, j) => {
      const t = j / 19
      return polar(1.80, a + t * TAU / 32, -2.18 - Math.sin(t * Math.PI) * .09)
    }), .013, false)
    thread(rose, Array.from({ length: 16 }, (_, j) => {
      const t = j / 16 * TAU
      return polar(1.80, a + Math.PI / 32 + .019 * Math.sin(t), -2.267 - .025 * (1 - Math.cos(t)))
    }), .008)
  }
  const merge = (parts: THREE.BufferGeometry[]) => {
    const geometry = mergeGeometries(parts)
    parts.forEach(part => part.dispose())
    return geometry
  }
  return { ivory: merge(ivory), rose: merge(rose) }
}

function PearlTrim() {
  const pearls = useRef<THREE.InstancedMesh>(null!)
  useLayoutEffect(() => {
    const matrix = new THREE.Matrix4()
    for (let i = 0; i < 64; i++) {
      const point = polar(1.79, i / 64 * TAU, -1.78)
      pearls.current.setMatrixAt(i, matrix.makeTranslation(point.x, point.y, point.z))
    }
    pearls.current.instanceMatrix.needsUpdate = true
    pearls.current.computeBoundingSphere()
  }, [])
  return <instancedMesh ref={pearls} args={[undefined, undefined, 64]}>
    <sphereGeometry args={[.023, 10, 8]}/>
    <meshStandardMaterial color="#fff4e9" roughness={.22} metalness={.12}/>
  </instancedMesh>
}

export default function IronworkStage({ gate = true }: { gate?: boolean }) {
  const lace = useMemo(laceGeometry, [])
  return <group>
    {gate && <ReferenceFence/>}
    <mesh geometry={lace.ivory} receiveShadow>
      <meshStandardMaterial color="#ffe5df" roughness={.78} metalness={0}/>
    </mesh>
    <mesh geometry={lace.rose}>
      <meshStandardMaterial color="#c96e99" roughness={.6} metalness={.06}/>
    </mesh>
    <PearlTrim/>
    <mesh position={[0, -1.785, 0]} receiveShadow>
      <cylinderGeometry args={[1.57, 1.57, .07, 96]}/>
      <meshStandardMaterial color="#f4cedf" roughness={.85} metalness={0}/>
    </mesh>
    <mesh position={[0, -2.205, 0]}>
      <cylinderGeometry args={[1.61, 1.56, .05, 96]}/>
      <meshStandardMaterial color="#d393b1" roughness={.7} metalness={.08}/>
    </mesh>
  </group>
}
