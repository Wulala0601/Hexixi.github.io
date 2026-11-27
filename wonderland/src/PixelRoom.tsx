import { useEffect, useRef, useState } from 'react'
import { assetUrl } from './assets'
import './pixel-room.css'

const W = 320
const H = 200
const GROUND = 168
const MIN_X = 24
const MAX_X = 296

type Kind = 'girl' | 'fish' | 'bei'
type Mood = 'idle' | 'walk' | 'phone' | 'read' | 'music' | 'exercise' | 'eat' | 'toilet' | 'smoke' | 'groom'

type Actor = {
  kind: Kind
  mood: Mood
  x: number
  dir: 1 | -1
  target: number
  timer: number
  tick: number
}

const S = {
  girl: {
    front: 'girl-front', side: 'girl-side', walk1: 'girl-walk1', walk2: 'girl-walk2',
    eat1: 'girl-eat1', eat2: 'girl-eat2', eat3: 'girl-eat3',
    smoke1: 'girl-smoke1', smoke2: 'girl-smoke2',
    toilet1: 'girl-toilet1', toilet2: 'girl-toilet2', toilet3: 'girl-toilet3',
    read1: 'girl-read1', read2: 'girl-read2',
    music1: 'girl-music1', music2: 'girl-music2',
    phone: 'girl-phone',
    dumbbell1: 'girl-dumbbell1', dumbbell2: 'girl-dumbbell2',
  },
  fish: {
    front: 'fish-front', side: 'fish-side', walk1: 'fish-walk1', walk2: 'fish-walk2',
    eat1: 'fish-eat1', eat2: 'fish-eat2', groom1: 'fish-groom1', groom2: 'fish-groom2',
  },
  bei: {
    front: 'bei-front', side: 'bei-side', walk1: 'bei-walk1', walk2: 'bei-walk2',
    eat1: 'bei-eat1', eat2: 'bei-eat2', groom1: 'bei-groom1', groom2: 'bei-groom2',
  },
} as const

/** 画布统一 640；下面两个比例来自素材本身：
 *  CONTENT：角色内容占画布高度的比例（用来把角色缩放到指定高度）
 *  FOOT：脚底在画布中的位置（用来对齐地面） */
const GEOM: Record<Kind, { content: number; foot: number; height: number }> = {
  girl: { content: 0.833, foot: 0.919, height: 122 },
  fish: { content: 0.591, foot: 0.897, height: 62 },
  bei: { content: 0.588, foot: 0.891, height: 62 },
}

const GIRL_LINES = [
  '你好呀~', '我肚子有点疼', '想抽烟了', '今天好冷噢', '你今天过的怎么样？',
  '最近是不是又胖了...', '想吃点辣的', '今天我拉了超大一坨噢', '嘻嘻~',
  '让我自己静一静呗', '好累啊！',
]
const FISH_LINES = ['喵~', '猫凹~', '老吴！！', '咪？', '嘛~~啊', '咕噜咕噜咕噜~', '喵喵喵喵喵！']
const BEI_LINES = FISH_LINES

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]

export default function PixelRoom() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hint, setHint] = useState('点一下他们，会跟你说话')
  const [ready, setReady] = useState(false)

  const st = useRef({
    imgs: {} as Record<string, HTMLImageElement>,
    room: null as HTMLImageElement | null,
    girl: { kind: 'girl' as Kind, mood: 'idle' as Mood, x: 150, dir: 1 as 1 | -1, target: 150, timer: 2600, tick: 0 },
    cats: [
      { kind: 'fish' as Kind, mood: 'idle' as Mood, x: 84, dir: 1 as 1 | -1, target: 84, timer: 2200, tick: 0 },
      { kind: 'bei' as Kind, mood: 'idle' as Mood, x: 210, dir: -1 as 1 | -1, target: 210, timer: 3200, tick: 0 },
    ] as Actor[],
    particles: [] as { x: number; y: number; vy: number; life: number; glyph: string; colour: string }[],
    bubbles: [] as { x: number; y: number; text: string; life: number; big?: boolean }[],
    t: 0,
    smokes: 0,
    shake: 0,
    toiletQueued: false,
  })

  useEffect(() => {
    let cancelled = false
    const files = [...Object.values(S.girl), ...Object.values(S.fish), ...Object.values(S.bei)]
    const imgs: Record<string, HTMLImageElement> = {}
    let loaded = 0
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

    const drawOne = (name: string, kind: Kind, x: number, dir: 1 | -1, dx = 0) => {
      const img = s.imgs[name]
      if (!img) return
      const g = GEOM[kind]
      const size = (g.height / g.content) * 1 // 画布显示边长
      const w = size
      const h = size
      const top = GROUND - h * g.foot
      ctx.save()
      ctx.translate(x + dx, top)
      if (dir === -1) { ctx.translate(w, 0); ctx.scale(-1, 1) }
      ctx.drawImage(img, 0, 0, w, h)
      ctx.restore()
    }

    const shadow = (x: number, kind: Kind) => {
      const g = GEOM[kind]
      const w = g.height * 0.55
      ctx.fillStyle = 'rgba(10,5,16,0.32)'
      ctx.beginPath()
      ctx.ellipse(x, GROUND - 1, w / 2, 4, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    const loop = (now: number) => {
      const dt = Math.min(50, now - last)
      last = now
      s.t += dt
      if (s.shake > 0) s.shake = Math.max(0, s.shake - dt)

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

      // 她的自动行为
      if (g.mood === 'idle' && g.timer <= 0) {
        if (!reduce && Math.random() < 0.4) {
          g.mood = 'phone'
          g.timer = 5200 + Math.random() * 5000
        } else if (!reduce) {
          g.mood = 'walk'
          g.target = MIN_X + 20 + Math.random() * (MAX_X - MIN_X - 40)
          g.timer = 4000
        } else {
          g.timer = 4000
        }
      }
      if (g.mood === 'walk') {
        const dx = g.target - g.x
        if (Math.abs(dx) < 3 || g.timer <= 0) {
          g.mood = 'idle'
          g.timer = 2400 + Math.random() * 3200
        } else {
          g.dir = dx > 0 ? 1 : -1
          g.x += g.dir * 0.042 * dt
        }
      }
      if (['phone', 'read', 'music', 'exercise', 'eat', 'toilet', 'smoke'].includes(g.mood) && g.timer <= 0) {
        g.mood = 'idle'
        g.timer = 2000
      }

      // 吃完一阵子去厕所（彩蛋）
      if (g.mood === 'eat' && g.timer < 200 && s.toiletQueued) {
        s.toiletQueued = false
        g.mood = 'toilet'
        g.timer = 4200
        say('……先去个洗手间', g.x, GROUND - GEOM.girl.height - 12)
      }

      // 猫：站立 / 走动 / 舔毛
      s.cats.forEach((c) => {
        c.timer -= dt
        if (c.mood === 'eat') {
          if (c.timer <= 0) { c.mood = 'idle'; c.timer = 2200 + Math.random() * 2600 }
          return
        }
        if (c.timer > 0) return
        const roll = Math.random()
        if (roll < 0.45) {
          c.mood = 'walk'
          c.target = MIN_X + Math.random() * (MAX_X - MIN_X)
          c.timer = 3000
        } else if (roll < 0.72) {
          c.mood = 'groom'
          c.timer = 2800 + Math.random() * 2200
        } else {
          c.mood = 'idle'
          c.timer = 2000 + Math.random() * 2800
        }
      })

      s.cats.forEach((c) => {
        if (c.mood !== 'walk') return
        const dx = c.target - c.x
        if (Math.abs(dx) < 3 || c.timer <= 0) {
          c.mood = 'idle'
          c.timer = 1800 + Math.random() * 2400
        } else {
          c.dir = dx > 0 ? 1 : -1
          c.x += c.dir * 0.032 * dt
        }
      })

      // 只做边界限制，不再互相推开（允许遮挡，看着更自然）
      g.x = Math.max(MIN_X + 14, Math.min(MAX_X - 14, g.x))
      s.cats.forEach((c) => { c.x = Math.max(MIN_X, Math.min(MAX_X, c.x)) })

      s.cats.forEach((c) => shadow(c.x, c.kind))
      shadow(g.x, 'girl')

      // 猫（先画，人后画 → 人挡住猫）
      s.cats.forEach((c) => {
        const set = c.kind === 'fish' ? S.fish : S.bei
        c.tick += dt
        if (c.mood === 'walk') {
          drawOne(c.tick % 300 < 150 ? set.walk1 : set.walk2, c.kind, c.x, c.dir)
        } else if (c.mood === 'groom') {
          drawOne(c.tick % 800 < 400 ? set.groom1 : set.groom2, c.kind, c.x, c.dir)
        } else if (c.mood === 'eat') {
          drawOne(c.tick % 700 < 350 ? set.eat1 : set.eat2, c.kind, c.x, c.dir)
        } else {
          drawOne(set.side, c.kind, c.x, c.dir)
        }
      })

      // 她
      g.tick += dt
      const shakeX = s.shake > 0 ? (Math.random() - 0.5) * 3 : 0
      switch (g.mood) {
        case 'walk':
          drawOne(g.tick % 300 < 150 ? S.girl.walk1 : S.girl.walk2, 'girl', g.x, g.dir, shakeX)
          break
        case 'phone':
          drawOne(S.girl.phone, 'girl', g.x, 1, shakeX)
          break
        case 'read':
          drawOne(g.tick % 2200 < 1100 ? S.girl.read1 : S.girl.read2, 'girl', g.x, 1, shakeX)
          break
        case 'music':
          drawOne(g.tick % 1000 < 500 ? S.girl.music1 : S.girl.music2, 'girl', g.x, 1, shakeX)
          break
        case 'exercise':
          drawOne(g.tick % 620 < 310 ? S.girl.dumbbell1 : S.girl.dumbbell2, 'girl', g.x, 1, shakeX)
          break
        case 'eat':
          drawOne([S.girl.eat1, S.girl.eat2, S.girl.eat3][Math.floor(g.tick / 340) % 3], 'girl', g.x, 1, shakeX)
          break
        case 'toilet':
          drawOne([S.girl.toilet1, S.girl.toilet2, S.girl.toilet3][Math.floor(g.tick / 900) % 3], 'girl', g.x, 1, shakeX)
          break
        case 'smoke':
          drawOne(g.tick % 1400 < 700 ? S.girl.smoke1 : S.girl.smoke2, 'girl', g.x, 1, shakeX)
          break
        default:
          drawOne(S.girl.front, 'girl', g.x, 1, shakeX)
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
        b.life -= dt / (b.big ? 3200 : 2400)
        if (b.life <= 0) return false
        ctx.globalAlpha = Math.max(0, Math.min(1, b.life * 1.6))
        const size = b.big ? 14 : 10
        ctx.font = `bold ${size}px "PingFang SC", monospace`
        const w = ctx.measureText(b.text).width + (b.big ? 16 : 12)
        const h = b.big ? 21 : 16
        ctx.fillStyle = 'rgba(18,9,24,0.9)'
        ctx.fillRect(b.x - w / 2, b.y - h, w, h)
        ctx.strokeStyle = b.big ? 'rgba(255,140,194,0.95)' : 'rgba(255,140,194,0.7)'
        ctx.strokeRect(b.x - w / 2 + 0.5, b.y - h - 0.5, w - 1, h)
        ctx.fillStyle = '#ffe8f3'
        ctx.fillText(b.text, b.x - w / 2 + (b.big ? 8 : 6), b.y - (b.big ? 5 : 4))
        ctx.globalAlpha = 1
        return true
      })

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [ready])

  // 气泡会往上叠，避免几句话糊在一起
  const say = (text: string, x: number, y: number, big = false) => {
    const s = st.current
    const near = s.bubbles.length
    const yy = Math.max(24, y - near * (big ? 26 : 20))
    s.bubbles.push({ x, y: yy, text, life: 1, big })
    if (s.bubbles.length > 4) s.bubbles.shift()
  }

  const act = (kind: 'music' | 'food' | 'exercise' | 'study' | 'rest') => {
    const s = st.current
    const g = s.girl
    const head = GROUND - GEOM.girl.height - 12
    if (kind === 'music') {
      g.mood = 'music'
      g.timer = 5200
      for (let i = 0; i < 4; i += 1) {
        s.particles.push({ x: g.x + 6, y: GROUND - GEOM.girl.height + 8 - i * 8, vy: -0.14, life: 1, glyph: '♪', colour: '#c9a7ff' })
      }
      setHint('她在听歌，脚在打拍子')
    } else if (kind === 'food') {
      g.mood = 'eat'
      g.timer = 3600
      s.toiletQueued = true
      s.cats.forEach((c) => { c.mood = 'eat'; c.timer = 3600 })
      s.particles.push({ x: g.x + 6, y: head, vy: -0.1, life: 1, glyph: '♥', colour: '#ff8cc2' })
      s.cats.forEach((c) => s.particles.push({ x: c.x + 8, y: GROUND - GEOM[c.kind].height - 2, vy: -0.1, life: 1, glyph: '♥', colour: '#ff8cc2' }))
      setHint('三个一起开饭')
    } else if (kind === 'exercise') {
      g.mood = 'exercise'
      g.timer = 6200
      for (let i = 0; i < 3; i += 1) {
        s.particles.push({ x: g.x - 8 - i * 4, y: GROUND - GEOM.girl.height + 34, vy: -0.1, life: 1, glyph: '✧', colour: '#9fe3d0' })
      }
      setHint('开始举哑铃，两只猫看都不看')
    } else if (kind === 'study') {
      g.mood = 'read'
      g.timer = 6800
      say('看会儿书', g.x, head)
      setHint('盘腿看书，房间安静下来')
    } else {
      // 休息 = 抽烟；抽太多会咳
      g.mood = 'smoke'
      g.timer = 7000
      s.smokes += 1
      for (let i = 0; i < 3; i += 1) {
        s.particles.push({ x: g.x + 4, y: GROUND - GEOM.girl.height + 6 - i * 6, vy: -0.18, life: 1, glyph: '◌', colour: 'rgba(220,210,235,0.8)' })
      }
      if (s.smokes >= 3) {
        s.smokes = 0
        s.shake = 700
        window.setTimeout(() => {
          say('咳咳！', g.x, head, true)
          for (let i = 0; i < 4; i += 1) {
            s.particles.push({ x: g.x + 2, y: GROUND - GEOM.girl.height + 8, vy: -0.22, life: 1, glyph: '✱', colour: '#ffb3d1' })
          }
          setHint('抽太多了，咳了两声')
        }, 2400)
        setHint('又点一根……')
      } else {
        setHint('抽根烟歇一会儿')
      }
    }
  }

  const poke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * W
    const s = st.current
    const all: Actor[] = [s.girl, ...s.cats]
    // 从右往左找最近的（人画在最上层，优先命中小孩以外的大目标）
    const hit = all
      .map((a) => ({ a, d: Math.abs(a.x - x), w: GEOM[a.kind].height * 0.85 }))
      .filter((it) => it.d < it.w)
      .sort((a, b) => a.d - b.d)[0]
    if (!hit) return
    const a = hit.a
    const lines = a.kind === 'girl' ? GIRL_LINES : a.kind === 'fish' ? FISH_LINES : BEI_LINES
    say(pick(lines), a.x, GROUND - GEOM[a.kind].height - 10)
    a.dir = (a.dir === 1 ? -1 : 1) as 1 | -1
    a.tick = 0
    setHint(a.kind === 'girl' ? '她回你一句' : '猫回你一句')
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
          aria-label="像素小房间：何茜茜和两只猫住在同一间房里"
        />
      </div>
      <div className="pr-bar">
        <span className="pr-hint">{ready ? hint : '正在把家具搬进来…'}</span>
        <div className="pr-actions">
          <button type="button" onClick={() => act('music')} disabled={!ready}>♪ 听音乐</button>
          <button type="button" onClick={() => act('food')} disabled={!ready}>♥ 喂饭</button>
          <button type="button" onClick={() => act('exercise')} disabled={!ready}>✧ 运动</button>
          <button type="button" onClick={() => act('study')} disabled={!ready}>▤ 学习</button>
          <button type="button" onClick={() => act('rest')} disabled={!ready}>☁ 休息</button>
        </div>
      </div>
    </div>
  )
}
