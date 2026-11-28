import { useEffect, useRef, useState } from 'react'
import { assetUrl } from './assets'
import { usePreferences } from './preferences'
import { sfx } from './retro-sfx'
import {
  FIGURES, coinsEarned, coinsLeft, getGacha, pullFigure, subscribe,
  type Figure, type GachaState,
} from './gacha-progress'
import './gacha-arcade.css'

const img = (name: string) => assetUrl(`/images/gacha/${name}.webp`)

const CAPSULES = ['mint', 'pink', 'red', 'forest', 'sky', 'brown'] as const

type Phase = 'idle' | 'turning' | 'falling' | 'floor' | 'held' | 'opened'
type Side = 'girl' | 'radio'

export default function GachaArcade() {
  const { t } = usePreferences()
  const [state, setState] = useState<GachaState>(getGacha)
  const [phase, setPhase] = useState<Phase>('idle')
  const [bubble, setBubble] = useState<{ text: string; side: Side } | null>(null)
  const [capsule, setCapsule] = useState<string>('pink')
  const [prize, setPrize] = useState<Figure | null>(null)
  const [turn, setTurn] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [inserted, setInserted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(55)
  const [folderOpen, setFolderOpen] = useState(false)
  const [line, setLine] = useState(0)

  const audio = useRef<HTMLAudioElement>(null)
  const world = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, last: 0, total: 0 })
  const pending = useRef<Figure | null>(null)
  const timers = useRef<number[]>([])

  useEffect(() => subscribe(() => setState(getGacha())), [])
  useEffect(() => { if (audio.current) audio.current.volume = volume / 100 }, [volume])
  useEffect(() => () => { timers.current.forEach((id) => window.clearTimeout(id)) }, [])

  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)) }
  const coins = coinsLeft(state)
  const earned = coinsEarned(state)

  const say = (text: string, side: Side = 'girl', ms = 3600) => {
    setBubble({ text, side })
    later(() => setBubble(null), ms)
  }

  /* ---------- 视差 + 头部跟随 ---------- */
  useEffect(() => {
    const el = world.current
    if (!el) return
    let raf = 0
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const mx = ((event.clientX - r.left) / r.width - 0.5) * 2
        const my = ((event.clientY - r.top) / r.height - 0.5) * 2
        el.style.setProperty('--mx', mx.toFixed(3))
        el.style.setProperty('--my', my.toFixed(3))
      })
    }
    window.addEventListener('pointermove', onMove)
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf) }
  }, [])

  /* ---------- 转把手 ---------- */
  const angleOf = (x: number, y: number) => {
    const el = handleRef.current
    if (!el) return 0
    const r = el.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    return (Math.atan2(y - cy, x - cx) * 180) / Math.PI
  }

  const startTurn = (event: React.PointerEvent<HTMLDivElement>) => {
    if (phase !== 'idle') return
    if (coins <= 0) {
      sfx.tick()
      say(earned >= 6 ? t('No coins left…', '硬币用完了…') : t('No coin yet — the doors below!', '先去下面的门里拿硬币 ↓'))
      return
    }
    drag.current = { active: true, last: angleOf(event.clientX, event.clientY), total: 0 }
    setDragging(true)
    try { (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId) } catch { /* ignore */ }
  }

  const moveTurn = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return
    const a = angleOf(event.clientX, event.clientY)
    let d = a - drag.current.last
    if (d > 180) d -= 360
    if (d < -180) d += 360
    drag.current.last = a
    drag.current.total += d
    setTurn(drag.current.total)
    if (Math.abs(drag.current.total) > 40 && Math.random() < 0.25) sfx.crankTick()
  }

  const endTurn = () => {
    if (!drag.current.active) return
    drag.current.active = false
    setDragging(false)
    const total = Math.abs(drag.current.total)
    drag.current.total = 0
    if (total > 190 && phase === 'idle') pull()
    else setTurn(0)
  }

  /* ---------- 真正抽一次 ---------- */
  const pull = () => {
    const result = pullFigure()
    if (!result) { setTurn(0); return }
    pending.current = result
    setTurn(0)
    setPhase('turning')
    sfx.crank()
    setCapsule(CAPSULES[Math.floor(Math.random() * CAPSULES.length)])
    later(() => { setPhase('falling'); sfx.drop() }, 900)
    later(() => sfx.drop(), 1250)
    later(() => sfx.drop(), 1420)
    later(() => setPhase('floor'), 1700)
  }

  /* ---------- 捡起来 → 打开 ---------- */
  const pickUp = () => {
    if (phase !== 'floor' && phase !== 'falling') return
    setPhase('held')
    sfx.tick()
  }

  const openCapsule = () => {
    if (phase !== 'held') return
    setPhase('opened')
    sfx.pop()
    later(() => {
      setPrize(pending.current)
      sfx.sparkle()
      later(() => sfx.fanfare(Boolean(pending.current?.rare)), 260)
    }, 420)
  }

  const reset = () => {
    setPrize(null)
    setPhase('idle')
    pending.current = null
  }

  /* ---------- 磁带机 ---------- */
  const hoverRadio = () => {
    if (inserted) return
    say(t('Some music, maybe? ♥', '是不是需要来点音乐呢 ♥'), 'radio', 3000)
  }

  const insertTape = () => {
    if (inserted) return
    setInserted(true)
    sfx.insert()
    later(() => {
      const el = audio.current
      if (!el) return
      el.volume = volume / 100
      void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    }, 400)
  }

  const togglePlay = () => {
    const el = audio.current
    if (!el) return
    if (el.paused) void el.play().then(() => setPlaying(true)).catch(() => {})
    else { el.pause(); setPlaying(false) }
  }

  const talk = () => {
    sfx.tick()
    const lines = coins > 0
      ? [t('Coins! Turn the handle!', '有硬币了！转一下把手！'), t('I want the gold one…', '我想要金色的那个…')]
      : [t('I want this whole series, but I have no coins. Help?', '我想集齐这一套，可是没有硬币…帮我？'),
        t('The doors downstairs have coins.', '下面的门里有硬币 ↓')]
    say(lines[line % lines.length])
    setLine((v) => v + 1)
  }

  const girlFrame = bubble?.side === 'girl' ? 'girl-talk' : prize ? 'girl-happy' : 'girl-idle'
  const showCapsule = phase === 'falling' || phase === 'floor'
  const showHeld = phase === 'held' || phase === 'opened'

  return (
    <section className="arc" aria-label={t('Gachapon arcade', '扭蛋机电玩城')}>
      <audio ref={audio} src={assetUrl('/media/miaozi-jam.mp3')} loop preload="none" />

      <div className={`arc-world is-${phase} ${playing ? 'is-playing' : ''}`} ref={world}>
        <div className="arc-parallax">
          <img className="arc-layer arc-bg" src={img('bg')} alt="" draggable={false} />
        </div>

        {/* 磁带机（放在地上） */}
        <div className={`arc-radio ${inserted ? 'has-tape' : ''}`} onMouseEnter={hoverRadio}
          onClick={inserted ? togglePlay : insertTape} role="button" tabIndex={0}
          aria-label={t('Cassette player', '磁带机')}
          onKeyDown={(e) => { if (e.key === 'Enter') { if (inserted) togglePlay(); else insertTape() } }}>
          <img src={img('radio')} alt="" draggable={false} />
          <span className="arc-radio-glow" aria-hidden="true" />
          <span className="arc-notes" aria-hidden="true"><i>♪</i><i>♫</i><i>♥</i></span>
        </div>

        {!inserted && (
          <button type="button" className="arc-cassette" onClick={insertTape}
            aria-label={t('Insert the cassette', '把磁带放进去')}>
            <img src={img('cassette')} alt="" draggable={false} />
          </button>
        )}

        {/* 磁带机的播放控制条 */}
        {inserted && (
          <div className="arc-ctrl">
            <button type="button" onClick={togglePlay} aria-label={playing ? 'pause' : 'play'}>
              {playing ? '❚❚' : '▶'}
            </button>
            <button type="button" onClick={() => setVolume((v) => Math.max(0, v - 10))} aria-label="volume down">−</button>
            <span className="arc-vol"><i style={{ width: `${volume}%` }} /></span>
            <button type="button" onClick={() => setVolume((v) => Math.min(100, v + 10))} aria-label="volume up">＋</button>
          </div>
        )}

        {/* 扭蛋机 */}
        <div className="arc-machine">
          <img src={img('machine')} alt="" draggable={false} />
          <div className={`arc-handle ${dragging ? 'is-grabbing' : ''}`} ref={handleRef}
            style={{ transform: `rotate(${turn}deg)` }}
            onPointerDown={startTurn} onPointerMove={moveTurn}
            onPointerUp={endTurn} onPointerCancel={endTurn}
            role="slider" aria-label={t('Turn the handle', '转动把手')} tabIndex={0}
            aria-valuenow={Math.round(Math.abs(turn))} aria-valuemin={0} aria-valuemax={360}
            onKeyDown={(e) => { if (e.key === 'Enter' && phase === 'idle' && coins > 0) pull() }}>
            <img src={img('handle')} alt="" draggable={false} />
          </div>
          {phase === 'idle' && coins > 0 && <span className="arc-hint">{t('TURN', '转我')}</span>}
        </div>

        {/* 少女 */}
        <button className="arc-girl" type="button" onClick={talk} aria-label={t('Talk to her', '和她说话')}>
          <img src={img(girlFrame)} alt="" draggable={false} />
        </button>

        {/* 掉下来的扭蛋 */}
        {showCapsule && (
          <button className={`arc-capsule-ball is-${phase}`} type="button" onClick={pickUp}
            aria-label={t('Pick up the capsule', '拿起扭蛋')}>
            <img src={img(`capsule-${capsule}-closed`)} alt="" draggable={false} />
          </button>
        )}

        {/* 拿在手里的扭蛋（放大居中） */}
        {showHeld && (
          <div className={`arc-hold is-${phase}`}>
            {phase === 'held' && (
              <button type="button" className="arc-hold-ball" onClick={openCapsule}
                aria-label={t('Open it', '打开它')}>
                <img src={img(`capsule-${capsule}-closed`)} alt="" draggable={false} />
              </button>
            )}
            {phase === 'opened' && (
              <>
                <span className="arc-flash" aria-hidden="true" />
                {prize && (
                  <div className="arc-figure">
                    <img src={img(prize.file)} alt={prize.name} draggable={false} />
                    <span className="arc-figure-shadow" aria-hidden="true" />
                  </div>
                )}
                <img className="arc-shell" src={img(`capsule-${capsule}-open`)} alt="" draggable={false} />
              </>
            )}
          </div>
        )}

        {/* 气泡 */}
        {bubble && (
          <div className={`arc-bubble is-${bubble.side}`} role="status">
            <span>{bubble.text}</span>
            <i className="arc-bubble-tail" aria-hidden="true" />
          </div>
        )}

        {/* HUD */}
        <div className="arc-hud">
          <span className="arc-coin"><i aria-hidden="true">◉</i>{coins}</span>
        </div>

        {/* 收藏文件夹 */}
        <button type="button" className="arc-folder" onClick={() => { sfx.tick(); setFolderOpen(true) }}
          aria-label={t('Collection folder', '收藏文件夹')}>
          <img src={img('folder')} alt="" draggable={false} />
          <span>{state.figures.length}/7</span>
        </button>

        {folderOpen && (
          <div className="arc-folder-panel">
            <div className="arc-panel-head">
              <b>{t('COLLECTION', '收藏夹')}</b>
              <button type="button" onClick={() => setFolderOpen(false)} aria-label={t('close', '关闭')}>×</button>
            </div>
            <ul>
              {FIGURES.map((f, i) => {
                const owned = state.figures.includes(f.key)
                return (
                  <li key={f.key} className={owned ? 'is-owned' : ''}>
                    <span className="arc-slot">{owned ? <img src={img(f.file)} alt={f.name} /> : '?'}</span>
                    <em>{owned ? f.name : `${String(i + 1).padStart(2, '0')}`}</em>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {/* 收获 */}
        {prize && phase === 'opened' && (
          <div className="arc-get">
            <p className="arc-get-line">
              <b>{prize.rare ? t('SECRET!', '隐藏款！') : t('GOT IT!', '获得了！')}</b>
              <span>{prize.name}</span>
            </p>
            <div className="arc-get-actions">
              <button type="button" onClick={() => { sfx.tick(); reset() }}>{t('KEEP', '收下')}</button>
              {coins > 0 && (
                <button type="button" className="ghost" onClick={() => { sfx.tick(); reset() }}>{t('AGAIN', '再来')}</button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 老录像质感 */}
      <div className="arc-vhs" aria-hidden="true" />
      <div className="arc-grain" aria-hidden="true" />
    </section>
  )
}
