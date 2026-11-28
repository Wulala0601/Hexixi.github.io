import { useEffect, useRef, useState } from 'react'
import { assetUrl } from './assets'
import { sfx } from './retro-sfx'
import {
  coinsEarned, coinsLeft, getGacha, pullFigure, subscribe,
  type GachaState,
} from './gacha-progress'
import './gacha-arcade.css'

const img = (name: string) => assetUrl(`/images/gacha/${name}.webp`)

type Phase = 'idle' | 'turning' | 'capsule' | 'open' | 'figure' | 'text'

const FIG_KEYS = ['caviar', 'anicat', 'eve', 'atb', 'clover', 'brine'] as const

export default function GachaArcade() {
  const [state, setState] = useState<GachaState>(getGacha)
  const [phase, setPhase] = useState<Phase>('idle')
  const [prize, setPrize] = useState<string | null>(null)
  const [dialog, setDialog] = useState<string | null>(null)
  const [noteMoved, setNoteMoved] = useState(false)
  const [inserted, setInserted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [folderOpen, setFolderOpen] = useState(false)
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null)

  const audio = useRef<HTMLAudioElement>(null)
  const world = useRef<HTMLDivElement>(null)
  const section = useRef<HTMLElement>(null)
  const tape = useRef<HTMLButtonElement>(null)
  const timers = useRef<number[]>([])

  useEffect(() => subscribe(() => setState(getGacha())), [])
  useEffect(() => () => { timers.current.forEach((id) => window.clearTimeout(id)) }, [])

  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)) }
  const coins = coinsLeft(state)
  const earned = coinsEarned(state)

  /* 视差 + 铺满 */
  useEffect(() => {
    const el = world.current
    if (!el) return
    let raf = 0
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        el.style.setProperty('--mx', (((event.clientX - r.left) / r.width - 0.5) * 2).toFixed(3))
        el.style.setProperty('--my', (((event.clientY - r.top) / r.height - 0.5) * 2).toFixed(3))
      })
    }
    window.addEventListener('pointermove', onMove)
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf) }
  }, [])

  useEffect(() => {
    const measure = () => {
      const el = section.current
      if (!el) return
      const header = document.querySelector('.header')
      const h = header ? Math.round(header.getBoundingClientRect().height) : 76
      let target = window.innerHeight - h
      if (window.scrollY < 2) {
        const rect = el.getBoundingClientRect()
        const gap = window.innerHeight - rect.bottom
        if (gap > 0 && gap < 240) target += gap
      }
      el.style.height = Math.max(460, Math.round(target)) + 'px'
    }
    measure()
    window.addEventListener('resize', measure)
    const a = window.setTimeout(measure, 400)
    const b = window.setTimeout(measure, 1200)
    return () => { window.removeEventListener('resize', measure); window.clearTimeout(a); window.clearTimeout(b) }
  }, [])

  const say = (text: string, ms = 4200) => {
    setDialog(text)
    later(() => setDialog(null), ms)
  }

  /* ---------- 抽 ---------- */
  const pull = () => {
    if (phase !== 'idle') return
    if (coins <= 0) {
      sfx.tick()
      say(earned >= 6 ? '硬币用完啦，去把最后一扇门看完吧' : '我还没有硬币…去下面的门里找找看？')
      return
    }
    const owned = new Set(state.figures)
    const pool = FIG_KEYS.filter((k) => !owned.has(k))
    const pick = pool.length ? pool[Math.floor(Math.random() * pool.length)] : FIG_KEYS[Math.floor(Math.random() * 6)]
    const result = pullFigure()
    if (!result) return
    setPrize(pick)
    setPhase('turning')
    sfx.crank()
    later(() => { setPhase('capsule'); sfx.drop() }, 950)
  }

  const openCapsule = () => {
    if (phase === 'capsule') {
      setPhase('open')
      sfx.pop()
    } else if (phase === 'open') {
      setPhase('figure')
      sfx.sparkle()
    } else if (phase === 'figure') {
      setPhase('text')
      sfx.tick()
    } else if (phase === 'text') {
      setPhase('idle')
      setPrize(null)
      sfx.fanfare()
      say('谢谢你！又多了一个收藏品呢好开心！', 5200)
    }
  }

  /* ---------- 纸条 → 音乐 ---------- */
  const clickNote = () => {
    if (noteMoved) return
    setNoteMoved(true)
    sfx.tick()
    say('我感觉有点无聊，要不我们放点音乐听吧?')
  }

  const insertTape = () => {
    if (inserted) return
    setInserted(true)
    sfx.insert()
    later(() => {
      const el = audio.current
      if (!el) return
      el.volume = 0.55
      void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    }, 380)
  }

  const onTapeDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    try { event.currentTarget.setPointerCapture(event.pointerId) } catch { /* ignore */ }
    setDrag({ x: 0, y: 0 })
  }

  const onTapeMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!drag) return
    const el = tape.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const dx = event.clientX - (r.left + r.width / 2)
    const dy = event.clientY - (r.top + r.height / 2)
    setDrag({ x: dx, y: dy })
  }

  const onTapeUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!drag) return
    const el = world.current
    setDrag(null)
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (event.clientX - r.left) / r.width
    const y = (event.clientY - r.top) / r.height
    // 磁带机大致占画面 13%–33% 宽、46%–78% 高
    if (x > 0.1 && x < 0.36 && y > 0.42 && y < 0.84) insertTape()
  }

  const girlFrame = dialog ? (state.figures.length && coins > 0 ? 'girl-talk' : 'girl-talk') : 'girl-idle'
  const showHappy = phase === 'text' || phase === 'figure' || (dialog?.includes('谢谢你') ?? false)
  const girlSrc = showHappy ? 'girl-happy' : girlFrame

  const capSrc = prize ? `cap-${prize}-${phase === 'capsule' ? 'closed' : phase === 'open' ? 'open' : 'text'}` : ''

  return (
    <section className="arc" ref={section} aria-label="扭蛋机电玩城">
      <audio ref={audio} src={assetUrl('/media/miaozi-jam.mp3')} loop preload="none" />

      <div className={`arc-world is-${phase} ${playing ? 'is-playing' : ''}`} ref={world}>
        <img className="layer bg" src={img('bg')} alt="" draggable={false} />

        {/* 小纸条（点它 → 飞到磁带机上） */}
        <button type="button" className={`layer note ${noteMoved ? 'is-moved' : ''}`} onClick={clickNote}
          aria-label="提示纸条">
          <img src={img('note')} alt="" draggable={false} />
        </button>

        <img className="layer radio" src={img('radio')} alt="" draggable={false} />

        {!inserted && (
          <button
            type="button"
            ref={tape}
            className={`layer tape ${drag ? 'is-dragging' : ''}`}
            style={drag ? { transform: `translate(${drag.x}px, ${drag.y}px)` } : undefined}
            onPointerDown={onTapeDown}
            onPointerMove={onTapeMove}
            onPointerUp={onTapeUp}
            onClick={insertTape}
            aria-label="磁带"
          >
            <img src={img('cassette')} alt="" draggable={false} />
          </button>
        )}

        <button type="button" className="layer machine" onClick={pull} aria-label="扭蛋机">
          <img src={img('machine')} alt="" draggable={false} />
        </button>

        <div className={`layer girl ${playing ? 'is-swaying' : ''}`}>
          <img src={img(girlSrc)} alt="" draggable={false} />
        </div>

        {/* 扭蛋：闭合 / 打开 / 打开+文字解释 */}
        {(phase === 'capsule' || phase === 'open' || phase === 'figure' || phase === 'text') && (
          <button type="button" className={`layer capsule is-${phase}`} onClick={openCapsule}
            aria-label="打开扭蛋">
            <img src={img(capSrc)} alt="" draggable={false} />
            {phase === 'text' && prize && <img src={img(`cap-${prize}-text`)} alt="" draggable={false} />}
          </button>
        )}

        {/* 对话框 */}
        {dialog && (
          <div className="layer dialog">
            <img src={img('dialog')} alt="" draggable={false} />
            <p className="dialog-text">{dialog}</p>
          </div>
        )}

        {/* 文件夹按钮 */}
        <button type="button" className="layer folder-btn" onClick={() => { sfx.tick(); setFolderOpen(true) }}
          aria-label="收藏文件夹">
          <img src={img('folder')} alt="" draggable={false} />
        </button>

        {/* 硬币数 */}
        <span className="arc-coins">◉ {coins}</span>
      </div>

      {/* 打开的笔记本 */}
      {folderOpen && (
        <div className="arc-folder" onClick={() => setFolderOpen(false)}>
          <div className="arc-folder-inner" onClick={(e) => e.stopPropagation()}>
            <img className="layer" src={img('folder-page')} alt="" draggable={false} />
            {state.figures.map((key) => (
              <img key={key} className="layer folder-fig" src={img(`folder-${key}`)} alt="" draggable={false} />
            ))}
            <button type="button" className="folder-close" onClick={() => setFolderOpen(false)} aria-label="关闭">×</button>
          </div>
        </div>
      )}

      <div className="arc-vhs" aria-hidden="true" />
      <div className="arc-grain" aria-hidden="true" />
    </section>
  )
}
