import { useEffect, useRef, useState } from 'react'
import { BEI, FISH, GIRL, TAIL_BLACK, TAIL_TABBY, type Sprite } from './pixel-sprites'
import './pixel-room.css'

const W = 170
const H = 108
const GROUND = 90

type Kind = 'girl' | 'fish' | 'bei'
type Mood = 'idle' | 'walk' | 'dance' | 'eat' | 'dizzy' | 'chase'

type Actor = {
  kind: Kind
  sprite: Sprite
  x: number
  y: number
  dir: 1 | -1
  mood: Mood
  target: number
  timer: number
  step: number
  bob: number
}

type Ball = { x: number; y: number; vx: number; vy: number; life: number }
type Particle = { x: number; y: number; vy: number; life: number; glyph: string; colour: string }
type Bubble = { x: number; y: number; text: string; life: number }

const MOOD_TEXT: Record<Kind, string[]> = {
  girl: ['在发呆', '想吃甜的', '今天也在改稿', '喵～'],
  fish: ['喵', '饿', '别摸肚子', '我最大'],
  bei: ['喵呜', '困', '罐头呢', '抱一下'],
}

function drawSprite(ctx: CanvasRenderingContext2D, sprite: Sprite, x: number, y: number, dir: 1 | -1, flipY = 0) {
  const { rows, palette } = sprite
  const w = rows[0].length
  const h = rows.length
  ctx.save()
  ctx.translate(Math.round(x), Math.round(y + flipY))
  if (dir === -1) {
    ctx.translate(w, 0)
    ctx.scale(-1, 1)
  }
  for (let row = 0; row < h; row += 1) {
    const line = rows[row]
    for (let col = 0; col < w; col += 1) {
      const ch = line[col]
      if (!ch || ch === '.') continue
      const colour = palette[ch]
      if (!colour) continue
      ctx.fillStyle = colour
      ctx.fillRect(col, row, 1, 1)
    }
  }
  ctx.restore()
}

export default function PixelRoom() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hint, setHint] = useState('点地上的人或猫，它们会理你')
  const stateRef = useRef({
    actors: [] as Actor[],
    ball: null as Ball | null,
    particles: [] as Particle[],
    bubbles: [] as Bubble[],
    t: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const make = (kind: Kind, sprite: Sprite, x: number): Actor => ({
      kind,
      sprite,
      x,
      y: GROUND - sprite.rows.length,
      dir: 1,
      mood: 'idle',
      target: x,
      timer: 800 + Math.random() * 1200,
      step: 0,
      bob: 0,
    })

    const st = stateRef.current
    st.actors = [make('girl', GIRL, 78), make('fish', FISH, 40), make('bei', BEI, 124)]
    st.ball = null
    st.particles = []
    st.bubbles = []

    let raf = 0
    let last = performance.now()

    const spawn = (x: number, y: number, glyph: string, colour: string) => {
      st.particles.push({ x, y, vy: -0.22 - Math.random() * 0.2, life: 1, glyph, colour })
    }

    const step = (now: number) => {
      const dt = Math.min(48, now - last)
      last = now
      st.t += dt

      // 背景
      ctx.clearRect(0, 0, W, H)
      const grad = ctx.createLinearGradient(0, 0, 0, H)
      grad.addColorStop(0, '#1a1024')
      grad.addColorStop(0.62, '#241433')
      grad.addColorStop(1, '#150c1e')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      // 地面 + 地毯
      ctx.fillStyle = '#2f1d40'
      ctx.fillRect(0, GROUND, W, H - GROUND)
      ctx.fillStyle = '#3a2450'
      ctx.fillRect(0, GROUND, W, 2)
      ctx.fillStyle = 'rgba(255,140,194,0.13)'
      ctx.fillRect(18, GROUND + 6, W - 36, H - GROUND - 14)

      // 窗（右上）
      ctx.fillStyle = '#120b1a'
      ctx.fillRect(112, 12, 42, 30)
      ctx.fillStyle = '#2a1d3f'
      ctx.fillRect(113, 13, 40, 28)
      ctx.fillStyle = 'rgba(255,220,240,0.75)'
      ctx.fillRect(118, 18, 1, 1)
      ctx.fillRect(126, 24, 1, 1)
      ctx.fillRect(136, 17, 1, 1)
      ctx.fillRect(144, 27, 1, 1)
      ctx.fillRect(131, 33, 1, 1)
      ctx.fillStyle = 'rgba(255,214,236,0.4)'
      ctx.fillRect(132, 13, 1, 28)
      ctx.fillRect(113, 26, 40, 1)

      // 台灯（左上）
      ctx.fillStyle = '#3d2a52'
      ctx.fillRect(20, 54, 2, 22)
      ctx.fillRect(14, 74, 14, 2)
      ctx.fillStyle = '#ffb3d1'
      ctx.fillRect(15, 46, 12, 3)
      ctx.fillRect(17, 49, 8, 2)
      ctx.fillStyle = 'rgba(255,214,236,0.5)'
      ctx.fillRect(18, 51, 6, 1)

      // 盆栽（右下）
      ctx.fillStyle = '#2f5a41'
      ctx.fillRect(150, 68, 3, 6)
      ctx.fillRect(155, 66, 3, 8)
      ctx.fillRect(146, 70, 3, 5)
      ctx.fillStyle = '#7a4a3a'
      ctx.fillRect(145, 76, 15, 7)
      ctx.fillStyle = '#5e3628'
      ctx.fillRect(145, 76, 15, 2)

      // 台灯的光
      const glow = ctx.createRadialGradient(24, 18, 2, 24, 18, 70)
      glow.addColorStop(0, 'rgba(255,214,236,0.30)')
      glow.addColorStop(1, 'rgba(255,214,236,0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, W, H)

      for (const a of st.actors) {
        a.timer -= dt

        // 状态机
        if (a.mood === 'idle' && a.timer <= 0 && !reduce) {
          a.mood = 'walk'
          a.target = 10 + Math.random() * (W - 40)
          a.timer = 4000
        }
        if (a.mood === 'walk') {
          const dx = a.target - a.x
          if (Math.abs(dx) < 2 || a.timer <= 0) {
            a.mood = 'idle'
            a.timer = 1200 + Math.random() * 2200
          } else {
            a.dir = dx > 0 ? 1 : -1
            a.x += a.dir * 0.07 * dt * 0.9
            a.step += dt
          }
        }
        if ((a.mood === 'eat' || a.mood === 'dizzy') && a.timer <= 0) {
          a.mood = 'idle'
          a.timer = 1500
        }
        if (a.mood === 'dance' && a.timer <= 0) {
          a.mood = 'idle'
          a.timer = 900
        }

        a.bob = a.mood === 'dance' ? Math.sin(st.t / 130) * 2 : a.mood === 'walk' ? Math.abs(Math.sin(a.step / 110)) * 1.5 : 0

        // 球：猫会追
        if (st.ball) {
          st.ball.x += st.ball.vx * dt
          st.ball.y += st.ball.vy * dt
          st.ball.vy += 0.0006 * dt
          if (st.ball.x < 6 || st.ball.x > W - 6) { st.ball.vx *= -1; st.ball.x = Math.max(6, Math.min(W - 6, st.ball.x)) }
          if (st.ball.y > GROUND - 3) { st.ball.y = GROUND - 3; st.ball.vy *= -0.62 }
          st.ball.life -= dt
          if (st.ball.life <= 0) st.ball = null

          if (a.kind !== 'girl' && st.ball) {
            a.mood = 'chase'
            const dx = st.ball.x - a.x
            a.dir = dx > 0 ? 1 : -1
            a.x += a.dir * 0.12 * dt
            a.step += dt
            if (Math.abs(dx) < 8) {
              st.ball.vx = -a.dir * (0.05 + Math.random() * 0.04)
              st.ball.vy = -0.16
              st.ball.life = 4000
              spawn(a.x, a.y - 2, '!', '#ff8cc2')
            }
          }
        }

        // 粒子
        // draw actor
        const frameBob = Math.round(a.bob)
        if (a.kind !== 'girl') {
          const tail = a.kind === 'fish' ? TAIL_BLACK : TAIL_TABBY
          drawSprite(ctx, tail, a.x - (a.dir === 1 ? 4 : -2), a.y + 6, a.dir, frameBob)
        }
        drawSprite(ctx, a.sprite, a.x, a.y, a.dir, frameBob)
      }

      // 球
      if (st.ball) {
        ctx.fillStyle = '#ff8cc2'
        ctx.beginPath()
        ctx.arc(st.ball.x, st.ball.y, 2.6, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = 'rgba(255,255,255,0.75)'
        ctx.fillRect(st.ball.x - 1, st.ball.y - 2, 1, 1)
      }

      // 粒子
      st.particles = st.particles.filter((p) => {
        p.y += p.vy * dt
        p.life -= dt / 1600
        if (p.life <= 0) return false
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life))
        ctx.fillStyle = p.colour
        ctx.font = 'bold 7px monospace'
        ctx.fillText(p.glyph, p.x, p.y)
        ctx.globalAlpha = 1
        return true
      })

      // 气泡
      st.bubbles = st.bubbles.filter((b) => {
        b.life -= dt / 2200
        if (b.life <= 0) return false
        ctx.globalAlpha = Math.max(0, Math.min(1, b.life * 1.4))
        ctx.font = 'bold 6px "PingFang SC", monospace'
        const w = ctx.measureText(b.text).width + 6
        ctx.fillStyle = 'rgba(20,10,26,0.86)'
        ctx.fillRect(b.x - w / 2, b.y - 12, w, 9)
        ctx.strokeStyle = 'rgba(255,140,194,0.7)'
        ctx.strokeRect(b.x - w / 2 + 0.5, b.y - 12.5, w - 1, 8)
        ctx.fillStyle = '#ffe8f3'
        ctx.fillText(b.text, b.x - w / 2 + 3, b.y - 5)
        ctx.globalAlpha = 1
        return true
      })

      raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  const act = (kind: 'music' | 'food' | 'ball') => {
    const st = stateRef.current
    if (kind === 'music') {
      st.actors.forEach((a) => { a.mood = 'dance'; a.timer = 5200 })
      st.actors.forEach((a) => {
        for (let i = 0; i < 3; i += 1) {
          st.particles.push({ x: a.x + 4, y: a.y - 2 - i * 4, vy: -0.16, life: 1, glyph: '♪', colour: '#c9a7ff' })
        }
      })
      st.bubbles.push({ x: W / 2, y: 26, text: '一起跳一段', life: 1 })
      setHint('它们在跟着节拍晃')
    } else if (kind === 'food') {
      st.actors.forEach((a) => { a.mood = 'eat'; a.timer = 4200 })
      st.actors.forEach((a) => {
        st.particles.push({ x: a.x + 5, y: a.y - 4, vy: -0.1, life: 1, glyph: '♥', colour: '#ff8cc2' })
        window.setTimeout(() => {
          st.particles.push({ x: a.x + 5, y: a.y - 6, vy: -0.2, life: 1, glyph: '°', colour: '#e6d9ef' })
          a.mood = 'dizzy'
          a.timer = 3600
        }, 1500)
      })
      st.bubbles.push({ x: W / 2, y: 26, text: '吃太饱了…', life: 1 })
      setHint('吃饱之后直接坐下了')
    } else {
      st.ball = { x: 30, y: 60, vx: 0.07, vy: -0.12, life: 6000 }
      setHint('球滚进来了，两只猫在追')
    }
  }

  const poke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * W
    const st = stateRef.current
    let hit: Actor | null = null
    for (const a of st.actors) {
      const w = a.sprite.rows[0].length
      if (x >= a.x - 6 && x <= a.x + w + 6) hit = a
    }
    if (!hit) return
    const lines = MOOD_TEXT[hit.kind]
    st.bubbles.push({ x: hit.x + hit.sprite.rows[0].length / 2, y: hit.y - 2, text: lines[Math.floor(Math.random() * lines.length)], life: 1 })
    hit.dir = hit.dir === 1 ? -1 : 1
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
          aria-label="像素小房间：你、鱼子酱和小贝在这里走动"
          role="img"
        />
      </div>
      <div className="pr-bar">
        <span className="pr-hint">{hint}</span>
        <div className="pr-actions">
          <button type="button" onClick={() => act('music')}>♪ 放音乐</button>
          <button type="button" onClick={() => act('food')}>♥ 喂饭</button>
          <button type="button" onClick={() => act('ball')}>● 丢球</button>
        </div>
      </div>
    </div>
  )
}
