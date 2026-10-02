import { assetUrl } from './assets'
import { useEffect, useMemo, useRef } from 'react'
import { usePreferences } from './preferences'
import sprites from './star-images.json'

export default function StarField() {
  const { reduced, quality } = usePreferences()
  const nodes = useRef<(HTMLImageElement | null)[]>([])
  const count = quality === 'high' ? 12 : quality === 'balanced' ? 10 : 8
  const stars = useMemo(() => Array.from({ length: count }, (_, i) => ({
    x: i < 8 ? (i % 2 ? .965 : .035) : .22 + (i - 8) * .185,
    y: i < 8 ? .18 + Math.floor(i / 2) * .22 : (i % 2 ? .94 : .085),
    size: 17 + (i % 3) * 4,
    angle: (i % 5 - 2) * 13,
  })), [count])
  useEffect(() => {
    let frame = 0, last = 0, elapsed = 0
    let width = innerWidth, height = innerHeight
    const pointer = { x: -1000, y: -1000 }
    const offsets = stars.map(() => ({ x: 0, y: 0 }))
    const draw = (now: number) => {
      const dt = Math.min((now - (last || now)) / 1000, .05)
      last = now; elapsed += dt
      stars.forEach((star, i) => {
        const mobile = width < 700
        const x = (mobile ? (i % 2 ? .97 : .03) : star.x) * width + (reduced ? 0 : Math.sin(elapsed * .35 + i * 2) * 7)
        const y = (mobile ? .12 + Math.floor(i / 2) / Math.ceil(count / 2) * .78 : star.y) * height + (reduced ? 0 : Math.cos(elapsed * .28 + i) * 10)
        const dx = x - pointer.x, dy = y - pointer.y
        const distance = Math.hypot(dx, dy)
        const force = reduced ? 0 : Math.max(0, 1 - distance / 125) * 110
        const targetX = distance > .1 ? dx / distance * force : force
        const targetY = distance > .1 ? dy / distance * force : 0
        const easing = 1 - Math.exp(-dt * 8)
        offsets[i].x += (targetX - offsets[i].x) * easing
        offsets[i].y += (targetY - offsets[i].y) * easing
        const element = nodes.current[i]
        if (element) element.style.transform = `translate3d(${Math.max(9, Math.min(width - 9, x + offsets[i].x))}px,${Math.max(9, Math.min(height - 9, y + offsets[i].y))}px,0) translate(-50%,-50%) rotate(${star.angle + (reduced ? 0 : Math.sin(elapsed * .3 + i) * 9)}deg)`
      })
      if (!reduced && !document.hidden) frame = requestAnimationFrame(draw)
    }
    const move = (e: PointerEvent) => { if (e.pointerType !== 'touch') { pointer.x = e.clientX; pointer.y = e.clientY } }
    const leave = () => { pointer.x = -1000; pointer.y = -1000 }
    const resize = () => { width = innerWidth; height = innerHeight; if (reduced) draw(performance.now()) }
    const visibility = () => { cancelAnimationFrame(frame); last = 0; if (!document.hidden) draw(performance.now()) }
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    window.addEventListener('blur', leave)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', visibility)
    draw(performance.now())
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave)
      window.removeEventListener('blur', leave); window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [stars, reduced, count])
  return <div className="star-field" aria-hidden="true">{stars.map((star, i) => <img key={i} ref={node => { nodes.current[i] = node }} src={assetUrl(sprites[(i * 3) % sprites.length])} alt="" draggable={false} width={star.size} height={star.size}/>)}</div>
}
