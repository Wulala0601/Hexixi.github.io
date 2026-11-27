import { useEffect, useRef, useState } from 'react'
import { assetUrl } from './assets'
import './pixel-room.css'

const W = 300
const H = 190
const GROUND = 160

type Kind = 'girl' | 'fish' | 'bei'
type Mood = 'idle' | 'hop' | 'dance' | 'eat' | 'dizzy' | 'chase'

type Actor = {
  kind: Kind
  img: HTMLImageElement | HTMLCanvasElement
  dh: number
  x: number
  dir: 1 | -1
  mood: Mood
  target: number
  timer: number
  phase: number
}

type Ball = { x: number; y: number; vx: number; vy: number; life: number }
type Particle = { x: number; y: number; vy: number; life: number; glyph: string; colour: string }
type Bubble = { x: number; y: number; text: string; life: number }

const LINES: Record<Kind, string[]> = {
  girl: ['在发呆', '想喝奶茶', '今天也在改稿', '喵？'],
  fish: ['喵', '饿了', '别摸肚子', '我是鱼子酱'],
  bei: ['喵呜', '想睡', '罐头呢', '抱一下'],
}

const SPEC: Record<Kind, { file: string; h: number }> = {
  girl: { file: 'girl', h: 118 },
  fish: { file: 'fish', h: 74 },
  bei: { file: 'bei', h: 78 },
}

export default function PixelRoom() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hint, setHint] = useState('点一下他们，会回头看你')
  const [ready, setReady] = useState(false)
  const st = useRef({
    actors: [] as Actor[],
    ball: null as Ball | null,
    particles: [] as Particle[],
    bubbles: [] as Bubble[],
    t: 0,
  })

  // 载入三张角色图
  useEffect(() => {
    let cancelled = false
    const loaded: Record<string, HTMLImageElement> = {}
    let count = 0
    ;(Object.keys(SPEC) as Kind[]).forEach((kind) => {
      const img = new Image()
      img.src = assetUrl(`/images/pixel/${SPEC[kind].file}.webp`)
      img.onload = () => {
        loaded[kind] = img
        count += 1
        if (count === 3 && !cancelled) {
          const s = st.current
          s.actors = (Object.keys(SPEC) as Kind[]).map((k, i) => ({
            kind: k,
            img: loaded[k],
            dh: SPEC[k].h,
            x: [118, 52, 196][i],
            dir: 1,
            mood: 'idle' as Mood,
            target: 0,
            timer: 1000 + i * 400,
            phase: i * 1.7,
          }))
          setReady(true)
        }
      }
    })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!ready) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const s = st.current
    let raf = 0
    let last = performance.now()

    const drawActor = (a: Actor) => {
      const w = (a.img.width / a.img.height) * a.dh
      const bob = a.mood === 'dance' ? Math.sin(s.t / 120 + a.phase) * 3 : a.mood === 'hop' || a.mood === 'chase' ? -Math.abs(Math.sin(s.t / 150 + a.phase)) * 8 : Math.sin(s.t / 700 + a.phase) * 1.2
      const squash = a.mood === 'eat' || a.mood === 'dizzy' ? 0.9 : 1
      const tilt = a.mood === 'dance' ? Math.sin(s.t / 120 + a.phase) * 0.06 : 0
      const y = GROUND - a.dh * squash + bob
      ctx.save()
      ctx.translate(a.x, y)
      if (a.dir === -1) ctx.scale(-1, 1)
      ctx.rotate(tilt)
      ctx.drawImage(a.img, -w / 2, 0, w, a.dh * squash)
      ctx.restore()
    }

    const loop = (now: number) => {
      const dt = Math.min(48, now - last)
      last = now
      s.t += dt

      // 房间
      const bg = ctx.createLinearGradient(0, 0, 0, H)
      bg.addColorStop(0, '#1a1024')
      bg.addColorStop(0.6, '#251536')
      bg.addColorStop(1, '#140b1c')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      // 窗
      ctx.fillStyle = '#100a18'
      ctx.fillRect(196, 18, 74, 52)
      ctx.fillStyle = '#2a1d3f'
      ctx.fillRect(198, 20, 70, 48)
      ctx.fillStyle = 'rgba(255,225,242,0.8)'
      for (const [x, y] of [[208, 28], [224, 40], [242, 26], [258, 44], [232, 56], [252, 58]]) ctx.fillRect(x, y, 2, 2)
      ctx.fillStyle = 'rgba(255,214,236,0.22)'
      ctx.fillRect(232, 20, 1, 48)
      ctx.fillRect(198, 42, 70, 1)

      // 台灯（最左，别挡角色）
      ctx.fillStyle = '#6b4a86'
      ctx.fillRect(15, 104, 3, 36)
      ctx.fillRect(6, 138, 22, 3)
      ctx.fillStyle = '#c98ab0'
      ctx.fillRect(8, 92, 16, 5)
      ctx.fillStyle = '#ffd0e4'
      ctx.fillRect(10, 96, 12, 4)
      ctx.fillStyle = '#4a3560'
      ctx.fillRect(8, 100, 16, 2)

      // 地面 + 地毯
      ctx.fillStyle = '#2f1d40'
      ctx.fillRect(0, GROUND, W, H - GROUND)
      ctx.fillStyle = '#3a2450'
      ctx.fillRect(0, GROUND, W, 2)
      ctx.fillStyle = 'rgba(255,140,194,0.12)'
      ctx.fillRect(20, GROUND + 6, W - 40, H - GROUND - 16)

      // 盆栽
      ctx.fillStyle = '#2f5a41'
      ctx.fillRect(268, 108, 4, 8)
      ctx.fillRect(274, 104, 4, 12)
      ctx.fillRect(262, 112, 4, 6)
      ctx.fillStyle = '#7a4a3a'
      ctx.fillRect(258, 120, 26, 10)
      ctx.fillStyle = '#5e3628'
      ctx.fillRect(258, 120, 26, 3)

      // 灯光
      const glow = ctx.createRadialGradient(16, 96, 4, 16, 104, 86)
      glow.addColorStop(0, 'rgba(255,214,236,0.26)')
      glow.addColorStop(1, 'rgba(255,214,236,0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, W, H)

      // 球
      if (s.ball) {
        s.ball.x += s.ball.vx * dt
        s.ball.y += s.ball.vy * dt
        s.ball.vy += 0.0008 * dt
        if (s.ball.x < 10 || s.ball.x > W - 10) { s.ball.vx *= -1; s.ball.x = Math.max(10, Math.min(W - 10, s.ball.x)) }
        if (s.ball.y > GROUND - 4) { s.ball.y = GROUND - 4; s.ball.vy *= -0.6 }
        s.ball.life -= dt
        if (s.ball.life <= 0) s.ball = null
      }

      s.actors.forEach((a) => {
        a.timer -= dt
        if (s.ball && a.kind !== 'girl') {
          a.mood = 'chase'
          const dx = s.ball.x - a.x
          a.dir = dx > 0 ? 1 : -1
          if (Math.abs(dx) > 6) a.x += a.dir * 0.08 * dt
          if (Math.abs(dx) < 14) {
            s.ball.vx = -a.dir * (0.07 + Math.random() * 0.05)
            s.ball.vy = -0.2
            s.ball.life = 4000
            s.particles.push({ x: a.x, y: GROUND - a.dh - 6, vy: -0.16, life: 1, glyph: '!', colour: '#ff8cc2' })
          }
        } else if (a.mood === 'chase') {
          a.mood = 'idle'
          a.timer = 600
        }

        if (a.mood === 'idle' && a.timer <= 0 && !reduce) {
          a.mood = 'hop'
          a.target = 60 + Math.random() * (W - 140)
          a.timer = 2400
        }
        if (a.mood === 'hop') {
          const dx = a.target - a.x
          if (Math.abs(dx) < 4 || a.timer <= 0) {
            a.mood = 'idle'
            a.timer = 1200 + Math.random() * 2000
          } else {
            a.dir = dx > 0 ? 1 : -1
            a.x += a.dir * 0.05 * dt
          }
        }
        if ((a.mood === 'eat' || a.mood === 'dizzy' || a.mood === 'dance') && a.timer <= 0) {
          a.mood = 'idle'
          a.timer = 1200
        }
      })

      s.actors.forEach(drawActor)

      if (s.ball) {
        ctx.fillStyle = '#ff8cc2'
        ctx.beginPath()
        ctx.arc(s.ball.x, s.ball.y, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = 'rgba(255,255,255,0.8)'
        ctx.fillRect(s.ball.x - 2, s.ball.y - 3, 2, 2)
      }

      s.particles = s.particles.filter((p) => {
        p.y += p.vy * dt
        p.life -= dt / 1700
        if (p.life <= 0) return false
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life))
        ctx.fillStyle = p.colour
        ctx.font = 'bold 11px monospace'
        ctx.fillText(p.glyph, p.x, p.y)
        ctx.globalAlpha = 1
        return true
      })

      s.bubbles = s.bubbles.filter((b) => {
        b.life -= dt / 2300
        if (b.life <= 0) return false
        ctx.globalAlpha = Math.max(0, Math.min(1, b.life * 1.4))
        ctx.font = 'bold 9px "PingFang SC", monospace'
        const w = ctx.measureText(b.text).width + 10
        ctx.fillStyle = 'rgba(18,9,24,0.9)'
        ctx.fillRect(b.x - w / 2, b.y - 16, w, 13)
        ctx.strokeStyle = 'rgba(255,140,194,0.75)'
        ctx.strokeRect(b.x - w / 2 + 0.5, b.y - 16.5, w - 1, 12)
        ctx.fillStyle = '#ffe8f3'
        ctx.fillText(b.text, b.x - w / 2 + 5, b.y - 6)
        ctx.globalAlpha = 1
        return true
      })

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [ready])

  const act = (kind: 'music' | 'food' | 'ball') => {
    const s = st.current
    if (!s.actors.length) return
    if (kind === 'music') {
      s.actors.forEach((a) => {
        a.mood = 'dance'
        a.timer = 5200
        for (let i = 0; i < 3; i += 1) {
          s.particles.push({ x: a.x + 4, y: GROUND - a.dh - 4 - i * 6, vy: -0.14, life: 1, glyph: '♪', colour: '#c9a7ff' })
        }
      })
      s.bubbles.push({ x: W * 0.36, y: 52, text: '一起跳一段', life: 1 })
      setHint('他们在跟着节拍晃')
    } else if (kind === 'food') {
      s.actors.forEach((a) => {
        a.mood = 'eat'
        a.timer = 2600
        s.particles.push({ x: a.x + 4, y: GROUND - a.dh - 6, vy: -0.12, life: 1, glyph: '♥', colour: '#ff8cc2' })
        window.setTimeout(() => {
          s.particles.push({ x: a.x + 6, y: GROUND - a.dh - 10, vy: -0.2, life: 1, glyph: '°', colour: '#e6d9ef' })
          a.mood = 'dizzy'
          a.timer = 3800
        }, 1600)
      })
      s.bubbles.push({ x: W * 0.36, y: 52, text: '吃太饱了…', life: 1 })
      setHint('吃饱之后坐下不动了')
    } else {
      s.ball = { x: 40, y: 70, vx: 0.08, vy: -0.14, life: 6000 }
      setHint('球滚进来了，两只猫去追')
    }
  }

  const poke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * W
    const s = st.current
    const hit = [...s.actors].reverse().find((a) => {
      const w = (a.img.width / a.img.height) * a.dh
      return x >= a.x - w / 2 && x <= a.x + w / 2
    })
    if (!hit) return
    const lines = LINES[hit.kind]
    s.bubbles.push({ x: hit.x, y: GROUND - hit.dh - 10, text: lines[Math.floor(Math.random() * lines.length)], life: 1 })
    hit.dir = hit.dir === 1 ? -1 : 1
    hit.mood = 'idle'
    setHint('它回头看了你一眼')
  }

  return (
    <div className="pr">
      <div className="pr-stage">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          onPointerDown={poke}
          role="img"
          aria-label="像素小房间：你、鱼子酱和小贝在这里待着"
        />
      </div>
      <div className="pr-bar">
        <span className="pr-hint">{ready ? hint : '把小客人们请进来…'}</span>
        <div className="pr-actions">
          <button type="button" onClick={() => act('music')} disabled={!ready}>♪ 放音乐</button>
          <button type="button" onClick={() => act('food')} disabled={!ready}>♥ 喂饭</button>
          <button type="button" onClick={() => act('ball')} disabled={!ready}>● 丢球</button>
        </div>
      </div>
    </div>
  )
}
