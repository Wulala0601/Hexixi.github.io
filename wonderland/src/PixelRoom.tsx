import { useEffect, useRef, useState } from 'react'
import { assetUrl } from './assets'
import './pixel-room.css'

const W = 320
const H = 200
const GROUND = 166

type Kind = 'girl' | 'fish' | 'bei'
type GirlMood = 'idle' | 'walk' | 'phone' | 'read' | 'music' | 'exercise' | 'eat' | 'toilet'
type CatMood = 'idle' | 'walk' | 'groom' | 'eat'

type Cat = {
  kind: 'fish' | 'bei'
  mood: CatMood
  x: number
  dir: 1 | -1
  target: number
  timer: number
  tick: number
  zone: [number, number]
}

const F = {
  girl: {
    front: 'girl-front', side: 'girl-side', walk1: 'girl-walk1', walk2: 'girl-walk2',
    eat1: 'girl-eat1', eat2: 'girl-eat2', toilet1: 'girl-toilet1', toilet2: 'girl-toilet2',
    read: 'girl-read', phone: 'girl-phone', music: 'girl-music',
    dumbbell1: 'girl-dumbbell1', dumbbell2: 'girl-dumbbell2',
  },
  fish: {
    front: 'fish-front', side: 'fish-side', walk1: 'fish-walk1', walk2: 'fish-walk2',
    eat: 'fish-eat', groom1: 'fish-groom1', groom2: 'fish-groom2',
  },
  bei: {
    front: 'bei-front', side: 'bei-side', walk1: 'bei-walk1', walk2: 'bei-walk2',
    eat: 'bei-eat', groom1: 'bei-groom1', groom2: 'bei-groom2',
  },
} as const

/** 每个角色导出时的统一高度，用来换算显示比例 */
const REF_H = { girl: 480, fish: 420, bei: 420 }
const DISPLAY_H = { girl: 122, fish: 56, bei: 60 }

const LINES = ['在发呆', '想喝奶茶', '今天也在改稿', '喵？', '别吵，在想事情']

export default function PixelRoom() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hint, setHint] = useState('点一下她，会回头看你')
  const [ready, setReady] = useState(false)

  const st = useRef({
    imgs: {} as Record<string, HTMLImageElement>,
    room: null as HTMLImageElement | null,
    girl: { mood: 'idle' as GirlMood, x: 150, dir: 1 as 1 | -1, target: 150, timer: 2600, tick: 0, toiletQueued: false },
    cats: [
      { kind: 'fish' as const, mood: 'idle' as CatMood, x: 86, dir: 1 as 1 | -1, target: 78, timer: 2200, tick: 0, zone: [72, 100] },
      { kind: 'bei' as const, mood: 'idle' as CatMood, x: 180, dir: -1 as 1 | -1, target: 186, timer: 3200, tick: 0, zone: [160, 196] },
    ] as Cat[],
    particles: [] as { x: number; y: number; vy: number; life: number; glyph: string; colour: string }[],
    bubbles: [] as { x: number; y: number; text: string; life: number }[],
    t: 0,
  })

  useEffect(() => {
    let cancelled = false
    const files = [
      ...Object.values(F.girl), ...Object.values(F.fish), ...Object.values(F.bei),
    ]
    let loaded = 0
    const imgs: Record<string, HTMLImageElement> = {}
    files.forEach((name) => {
      const img = new Image()
      img.onload = () => {
        imgs[name] = img
        loaded += 1
        if (loaded === files.length && !cancelled) {
          st.current.imgs = imgs
          setReady(true)
        }
      }
      img.src = assetUrl(`/images/pixel/${name}.webp`)
    })
    const room = new Image()
    room.onload = () => { st.current.room = room }
    room.src = assetUrl('/images/pixel/room-bg.webp')
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!ready) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const s = st.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let last = performance.now()

    const drawSprite = (name: string, kind: Kind, x: number, dir: 1 | -1, bob = 0) => {
      const img = s.imgs[name]
      if (!img) return
      const k = DISPLAY_H[kind] / REF_H[kind]
      const w = img.width * k
      const h = img.height * k
      ctx.save()
      ctx.translate(x, GROUND - h + bob)
      if (dir === -1) { ctx.translate(w, 0); ctx.scale(-1, 1) }
      ctx.drawImage(img, 0, 0, w, h)
      ctx.restore()
      return { w, h }
    }

    const shadow = (x: number, kind: Kind) => {
      const k = DISPLAY_H[kind] / REF_H[kind]
      const ref = kind === 'girl' ? s.imgs[F.girl.front] : s.imgs[kind === 'fish' ? F.fish.side : F.bei.side]
      if (!ref) return
      const w = Math.max(18, ref.width * k * 0.52)
      ctx.fillStyle = 'rgba(10,5,16,0.35)'
      ctx.beginPath()
      ctx.ellipse(x, GROUND - 1, w / 2, 4, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    const loop = (now: number) => {
      const dt = Math.min(50, now - last)
      last = now
      s.t += dt

      // 背景
      if (s.room) {
        const r = s.room
        const scale = Math.max(W / r.width, H / r.height)
        const dw = r.width * scale
        const dh = r.height * scale
        ctx.drawImage(r, (W - dw) / 2, (H - dh) / 2, dw, dh)
      } else {
        ctx.fillStyle = '#1a1024'
        ctx.fillRect(0, 0, W, H)
      }

      const g = s.girl
      g.timer -= dt

      // 女孩状态机
      if (g.mood === 'idle' && g.timer <= 0) {
        if (!reduce && Math.random() < 0.42) {
          g.mood = 'phone'
          g.timer = 5200 + Math.random() * 5000
        } else if (!reduce) {
          g.mood = 'walk'
          g.target = 112 + Math.random() * 38
          g.timer = 4000
        } else {
          g.timer = 4000
        }
      }
      if (g.mood === 'walk') {
        const dx = g.target - g.x
        if (Math.abs(dx) < 3 || g.timer <= 0) {
          g.mood = 'idle'
          g.timer = 2600 + Math.random() * 3200
        } else {
          g.dir = dx > 0 ? 1 : -1
          g.x += g.dir * 0.042 * dt
        }
      }
      if (['phone', 'read', 'music', 'exercise', 'eat', 'toilet'].includes(g.mood) && g.timer <= 0) {
        g.mood = 'idle'
        g.timer = 2000
        if (g.toiletQueued && s.t > 0) {
          // 吃完一段时间后的彩蛋
        }
      }

      // 吃东西 → 过一会儿去马桶（彩蛋）
      if (g.mood === 'eat' && g.timer < 200 && g.toiletQueued) {
        g.toiletQueued = false
        g.mood = 'toilet'
        g.timer = 4200
        s.bubbles.push({ x: g.x, y: GROUND - DISPLAY_H.girl - 14, text: '……先去个洗手间', life: 1 })
      }

      // 猫：站立 / 走动 / 舔毛
      s.cats.forEach((c) => {
        c.timer -= dt
        if (c.mood === 'eat') {
          if (c.timer <= 0) { c.mood = 'idle'; c.timer = 2400 + Math.random() * 2600 }
          return
        }
        if (c.timer > 0) return
        const roll = Math.random()
        if (roll < 0.45) {
          c.mood = 'walk'
          c.target = c.zone[0] + Math.random() * (c.zone[1] - c.zone[0])
          c.timer = 3000
        } else if (roll < 0.75) {
          c.mood = 'groom'
          c.timer = 3000 + Math.random() * 2200
        } else {
          c.mood = 'idle'
          c.timer = 2200 + Math.random() * 3000
        }
      })

      // 猫走动
      s.cats.forEach((c) => {
        if (c.mood !== 'walk') return
        const dx = c.target - c.x
        if (Math.abs(dx) < 3 || c.timer <= 0) {
          c.mood = 'idle'
          c.timer = 2000 + Math.random() * 2600
        } else {
          c.dir = dx > 0 ? 1 : -1
          c.x += c.dir * 0.032 * dt
        }
      })

      // 位置校正：夹在走动区域内，猫与猫、猫与人之间保持距离
      const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
      g.x = clamp(g.x, 110, 152)
      s.cats.forEach((c) => { c.x = clamp(c.x, c.zone[0], c.zone[1]) })
      const [c1, c2] = s.cats
      if (c2.x - c1.x < 58) {
        const mid = (c1.x + c2.x) / 2
        c1.x = clamp(mid - 29, c1.zone[0], c1.zone[1])
        c2.x = clamp(mid + 29, c2.zone[0], c2.zone[1])
      }
      s.cats.forEach((c) => {
        if (Math.abs(c.x - g.x) < 58) {
          const away = c.x >= g.x ? 1 : -1
          c.x = clamp(c.x + away * 0.6, c.zone[0], c.zone[1])
        }
      })

      s.cats.forEach((c) => shadow(c.x, c.kind))
      shadow(g.x, 'girl')

      // 猫
      s.cats.forEach((c) => {
        const set = c.kind === 'fish' ? F.fish : F.bei
        c.tick += dt
        if (c.mood === 'walk') {
          drawSprite(c.tick % 320 < 160 ? set.walk1 : set.walk2, c.kind, c.x, c.dir, -1)
        } else if (c.mood === 'groom') {
          drawSprite(c.tick % 900 < 450 ? set.groom1 : set.groom2, c.kind, c.x, c.dir)
        } else if (c.mood === 'eat') {
          drawSprite(set.eat, c.kind, c.x, c.dir)
        } else {
          drawSprite(set.side, c.kind, c.x, c.dir)
        }
      })

      // 女孩
      g.tick += dt
      const walking = g.mood === 'walk'
      const bob = walking ? Math.abs(Math.sin(g.tick / 110)) * 1.6 : 0
      switch (g.mood) {
        case 'walk':
          drawSprite(g.tick % 320 < 160 ? F.girl.walk1 : F.girl.walk2, 'girl', g.x, g.dir, -bob)
          break
        case 'phone':
          drawSprite(F.girl.phone, 'girl', g.x, 1)
          break
        case 'read':
          drawSprite(F.girl.read, 'girl', g.x, 1)
          break
        case 'music':
          drawSprite(F.girl.music, 'girl', g.x, 1)
          break
        case 'exercise':
          drawSprite(g.tick % 700 < 350 ? F.girl.dumbbell1 : F.girl.dumbbell2, 'girl', g.x, 1)
          break
        case 'eat':
          drawSprite(g.tick % 900 < 450 ? F.girl.eat1 : F.girl.eat2, 'girl', g.x, 1)
          break
        case 'toilet':
          drawSprite(g.tick % 1100 < 550 ? F.girl.toilet1 : F.girl.toilet2, 'girl', g.x, 1)
          break
        default:
          drawSprite(F.girl.front, 'girl', g.x, 1)
      }

      // 粒子
      s.particles = s.particles.filter((p) => {
        p.y += p.vy * dt
        p.life -= dt / 1600
        if (p.life <= 0) return false
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life))
        ctx.fillStyle = p.colour
        ctx.font = 'bold 12px monospace'
        ctx.fillText(p.glyph, p.x, p.y)
        ctx.globalAlpha = 1
        return true
      })

      // 气泡
      s.bubbles = s.bubbles.filter((b) => {
        b.life -= dt / 2400
        if (b.life <= 0) return false
        ctx.globalAlpha = Math.max(0, Math.min(1, b.life * 1.5))
        ctx.font = 'bold 10px "PingFang SC", monospace'
        const w = ctx.measureText(b.text).width + 12
        ctx.fillStyle = 'rgba(18,9,24,0.9)'
        ctx.fillRect(b.x - w / 2, b.y - 18, w, 15)
        ctx.strokeStyle = 'rgba(255,140,194,0.75)'
        ctx.strokeRect(b.x - w / 2 + 0.5, b.y - 18.5, w - 1, 14)
        ctx.fillStyle = '#ffe8f3'
        ctx.fillText(b.text, b.x - w / 2 + 6, b.y - 7)
        ctx.globalAlpha = 1
        return true
      })

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [ready])

  const act = (kind: 'music' | 'food' | 'exercise' | 'study') => {
    const s = st.current
    const g = s.girl
    if (kind === 'music') {
      g.mood = 'music'
      g.timer = 5200
      for (let i = 0; i < 4; i += 1) {
        s.particles.push({ x: g.x + 6, y: GROUND - DISPLAY_H.girl + 10 - i * 8, vy: -0.14, life: 1, glyph: '♪', colour: '#c9a7ff' })
      }
      setHint('她在听歌，脚在打拍子')
    } else if (kind === 'food') {
      g.mood = 'eat'
      g.timer = 3600
      g.toiletQueued = true
      s.cats.forEach((c) => { c.mood = 'eat'; c.timer = 3600 })
      s.particles.push({ x: g.x + 6, y: GROUND - DISPLAY_H.girl - 4, vy: -0.1, life: 1, glyph: '♥', colour: '#ff8cc2' })
      s.cats.forEach((c) => s.particles.push({ x: c.x + 10, y: GROUND - DISPLAY_H[c.kind] - 2, vy: -0.1, life: 1, glyph: '♥', colour: '#ff8cc2' }))
      setHint('三个一起开饭')
    } else if (kind === 'exercise') {
      g.mood = 'exercise'
      g.timer = 6200
      for (let i = 0; i < 3; i += 1) {
        s.particles.push({ x: g.x - 8 - i * 4, y: GROUND - DISPLAY_H.girl + 30, vy: -0.1, life: 1, glyph: '✧', colour: '#9fe3d0' })
      }
      setHint('开始举哑铃，两只猫看都不看')
    } else {
      g.mood = 'read'
      g.timer = 6800
      s.bubbles.push({ x: g.x, y: GROUND - DISPLAY_H.girl - 12, text: '看会儿书', life: 1 })
      setHint('盘腿看书，房间安静下来')
    }
  }

  const poke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * W
    const s = st.current
    const g = s.girl
    const k = DISPLAY_H.girl / REF_H.girl
    const ref = s.imgs[F.girl.front]
    if (!ref) return
    const w = ref.width * k
    // 只响应她本人；猫很高冷，点了不理
    if (x < g.x - w / 2 || x > g.x + w / 2) return
    s.bubbles.push({ x: g.x, y: GROUND - DISPLAY_H.girl - 12, text: LINES[Math.floor(Math.random() * LINES.length)], life: 1 })
    setHint('她抬头看了你一眼')
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
          aria-label="像素小房间：何茜茜和两只猫在同一间房里"
        />
      </div>
      <div className="pr-bar">
        <span className="pr-hint">{ready ? hint : '正在把家具搬进来…'}</span>
        <div className="pr-actions">
          <button type="button" onClick={() => act('music')} disabled={!ready}>♪ 听音乐</button>
          <button type="button" onClick={() => act('food')} disabled={!ready}>♥ 喂饭</button>
          <button type="button" onClick={() => act('exercise')} disabled={!ready}>✧ 运动</button>
          <button type="button" onClick={() => act('study')} disabled={!ready}>▤ 学习</button>
        </div>
      </div>
    </div>
  )
}
