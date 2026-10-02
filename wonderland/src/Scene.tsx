import { assetUrl } from './assets'
import { Suspense, useEffect, useMemo, useRef, useState, Component, type ReactNode } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { useGLTF, useProgress } from '@react-three/drei'
import * as THREE from 'three'
import { usePreferences, type Quality } from './preferences'
import { journey } from './timeline'
import IronworkStage from './IronworkStage'

const palette = ['#ffc9e6','#ffc9e6','#c5f6e5','#ffd5e8','#ffc9e6']
class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}
function LoadingReadout() {
  const { progress, active, errors } = useProgress()
  const { t } = usePreferences()
  return active || errors.length ? <div className="resource-status" role="status">{errors.length ? t('A little error. The artwork is still here.', '遇到一点小故障，作品仍可正常阅读。') : <>{t('Putting soft errors back together', '正在把柔软的错误装回去')} <b>{Math.round(progress)}%</b><progress value={progress} max={100} aria-label={t('3D resources loaded', '3D 资源加载进度')} /></>}</div> : null
}
function Guide({ scale = 3.4, position = [0, 0, 0] as [number, number, number], interactive = false }: { scale?: number; position?: [number, number, number]; interactive?: boolean }) {
  // The reference site uses this upright mint catgirl as its main IP mark.
  // Keep the web-optimized derivative local so the home scene does not depend on a CDN.
  const { scene } = useGLTF(assetUrl('/models/standing-catgirl.glb'))
  const ref = useRef<THREE.Group>(null!)
  const drag = useRef<{ x: number; rotation: number } | null>(null)
  const rotation = useRef(-.2)
  const { reduced } = usePreferences()
  const normalized = useMemo(() => {
    const copy = scene.clone(true)
    const box = new THREE.Box3().setFromObject(copy)
    const size = box.getSize(new THREE.Vector3()); const center = box.getCenter(new THREE.Vector3())
    copy.position.sub(center); const group = new THREE.Group(); group.add(copy); group.scale.setScalar(1 / size.y)
    copy.traverse(obj => { if (obj instanceof THREE.Mesh) { obj.castShadow = true; obj.receiveShadow = true } })
    return group
  }, [scene])
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.position.y = position[1] + (reduced ? 0 : Math.sin(clock.elapsedTime * 1.1) * .055)
    ref.current.rotation.y = rotation.current + (reduced ? 0 : Math.sin(clock.elapsedTime * .25) * .07)
    ref.current.rotation.z = reduced ? 0 : Math.sin(clock.elapsedTime * .7) * .015
  })
  const down = (e: ThreeEvent<PointerEvent>) => { if (!interactive) return; e.stopPropagation(); drag.current = { x: e.clientX, rotation: rotation.current }; (e.target as Element).setPointerCapture?.(e.pointerId) }
  const move = (e: ThreeEvent<PointerEvent>) => { if (drag.current) rotation.current = drag.current.rotation + (e.clientX - drag.current.x) * .013 }
  const up = () => { drag.current = null }
  return <group ref={ref} position={position} scale={scale} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}><primitive object={normalized} /></group>
}
function CameraRig({ reduced, product }: { reduced: boolean; product: boolean }) {
  const { camera, size } = useThree()
  const look = useMemo(() => new THREE.Vector3(),[])
  useFrame(() => {
    if(product) { camera.position.set(0,.25,5.5); camera.lookAt(0,0,0); return }
    const p = journey.progress; const local = p - Math.floor(p)
    const travel = reduced ? 0 : Math.sin(local * Math.PI) * .65
    const mobile = size.width < 700
    camera.position.set((reduced ? 0 : Math.sin(p * .7) * .3) + (mobile ? 0 : -.25), .18 + travel * .2, (mobile ? 8.4 : 7) - travel)
    look.set(mobile ? -.12 : -.35, 0, 0); camera.lookAt(look)
  })
  return null
}
function JourneyWorld({ quality, reduced, product }: { quality:Quality; reduced:boolean; product:boolean }) {
  const [chapter,setChapter]=useState(journey.chapter)
  const group = useRef<THREE.Group>(null!)
  const { size } = useThree()
  useFrame(()=>{
    if(chapter!==journey.chapter)setChapter(journey.chapter)
    if(group.current) {
      const mobile = window.innerWidth < 700
      const stage = product || chapter <= 1
      group.current.position.set(product ? 0 : mobile ? .1 : 1.05, stage ? .12 : 0, 0)
      const fit = mobile ? Math.min(.84, size.width / size.height * 1.3) : .84
      group.current.scale.setScalar(stage ? fit : chapter === 4 ? .75 : 1)
    }
  })
  return <>
    <CameraRig reduced={reduced} product={product}/>
    <ambientLight intensity={.9}/>
    <directionalLight position={[3,6,5]} intensity={3} castShadow={quality==='high'} shadow-mapSize={[1024,1024]}/>
    <directionalLight position={[-4,1,3]} intensity={1.8} color="#e5f7f3"/>
    <pointLight position={[2,-1,3]} intensity={10} color={palette[chapter]}/>
    <group ref={group}><Suspense fallback={null}>
      {product || chapter <= 1 ? <><IronworkStage/><Guide interactive position={[0,-.04,.25]}/></>
        : chapter===4 ? <Guide scale={2.8} position={[0,-.2,0]}/> : null}
    </Suspense></group>
  </>
}
export default function Scene({ product = false, paused = false }: { product?: boolean; paused?: boolean }) {
  const {quality,reduced,t}=usePreferences()
  const [visible,setVisible]=useState(!document.hidden)
  useEffect(()=>{const update=()=>setVisible(!document.hidden);document.addEventListener('visibilitychange',update);return()=>document.removeEventListener('visibilitychange',update)},[])
  const fallback=<div className="scene-error"><img className="scene-fallback-art" src={assetUrl('/images/ip-standing.webp')} alt={t('Mint catgirl IP standing figure','薄荷猫耳少女站立 IP 形象')} /><div><p>{t('The 3D world is taking a little rest.', '3D 世界正在休息一下。')}</p><p>{t('All projects and contact details are available below.', '全部作品与联系方式仍可正常浏览。')}</p></div></div>
  return <SceneBoundary fallback={fallback}><Canvas fallback={fallback} dpr={quality==='high'?[1,1.8]:quality==='balanced'?[1,1.35]:[.7,1]} shadows={quality==='high'} frameloop={visible && !paused?'always':'never'} gl={{antialias:quality!=='lite',alpha:true,powerPreference:quality==='lite'?'low-power':'high-performance'}} camera={{fov:38,near:.1,far:40,position:[0,.2,7]}} onCreated={({gl})=>{gl.setClearColor(0x171a17,0);gl.domElement.addEventListener('webglcontextlost',event=>event.preventDefault())}}><JourneyWorld quality={quality} reduced={reduced} product={product}/></Canvas><LoadingReadout/></SceneBoundary>
}
