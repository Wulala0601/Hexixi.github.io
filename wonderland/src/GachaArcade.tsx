import { useEffect, useRef, useState } from 'react'
import { assetUrl } from './assets'
import { usePreferences } from './preferences'
import { sfx } from './retro-sfx'
import {
  coinsEarned, coinsLeft, getGacha, pullFigure, subscribe,
  type Figure, type GachaState,
} from './gacha-progress'
import './gacha-arcade.css'

const img = (name: string) => assetUrl(`/images/gacha/${name}.webp`)

const CAPSULES = ['mint', 'pink', 'red', 'forest', 'sky', 'brown'] as const

type Phase = 'idle' | 'prompt' | 'crank' | 'drop' | 'capsule' | 'open'

export default function GachaArcade() {
  const { t } = usePreferences()
  const [state, setState] = useState<GachaState>(getGacha)
  const [phase, setPhase] = useState<Phase>('idle')
  const [bubble, setBubble] = useState<{ text: string; side: 'girl' | 'radio' } | null>(null)
  const [prize, setPrize] = useState<Figure | null>(null)
  const [capsule, setCapsule] = useState<string>('pink')
  const [inserted, setInserted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [line, setLine] = useState(0)

  const audio = useRef<HTMLAudioElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])

  useEffect(() => subscribe(() => setState(getGacha())), [])
  useEffect(() => () => { timers.current.forEach((id) => window.clearTimeout(id)) }, [])

  const coins = coinsLeft(state)

  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)) }

  const say = (text: string, side: 'girl' | 'radio' = 'girl', ms = 4200) => {
    setBubble({ text, side })
    later(() => setBubble(null), ms)
  }

  /* ---------- 点少女 ---------- */
  const talk = () => {
    sfx.tick()
    const lines = coins > 0
      ? [t('Coins! Spin it, spin it!', '有硬币了！快扭！'), t('I want the gold one…', '我想要金色的那个…')]
      : [t('I want this whole series, but I am out of coins. Help?', '我想集齐这一套，可是没有硬币了…帮我？'),
        t('The doors downstairs give coins, I think.', '下面的门里好像有硬币 ↓')]
    say(lines[line % lines.length])
    setLine((v) => v + 1)
  }

  /* ---------- 点机器 → 提示「扭一下」 ---------- */
  const askSpin = () => {
    if (phase !== 'idle' && phase !== 'prompt') return
    if (coins <= 0) {
      sfx.tick()
      say(earned() >= 6 ? t('Out of coins…', '硬币用完了…') : t('No coin yet — the doors below!', '先去下面的门里拿硬币 ↓'))
      return
    }
    sfx.coin()
    setPhase('prompt')
    setBubble(null)
  }

  /* ---------- 扭：把手转 + 掉蛋 ---------- */
  const crank = () => {
    if (phase !== 'prompt') return
    const result = pullFigure()
    if (!result) return
    setPhase('crank')
    sfx.crank()
    setCapsule(CAPSULES[Math.floor(Math.random() * CAPSULES.length)])
    later(() => { setPhase('drop'); sfx.drop() }, 1150)
    later(() => { setPhase('capsule'); setPrizePending(result) }, 2100)
    later(() => { setBubble(null) }, 400)
  }

  const pending = useRef<Figure | null>(null)
  const setPrizePending = (f: Figure) => { pending.current = f }

  /* ---------- 点扭蛋：打开 ---------- */
  const openCapsule = () => {
    if (phase !== 'capsule') return
    setPhase('open')
    sfx.pop()
    later(() => {
      const f = pending.current
      if (f) {
        setPrize(f)
        sfx.fanfare(Boolean(f.rare))
      }
    }, 520)
  }

  const reset = () => {
    setPrize(null)
    setPhase('idle')
    pending.current = null
  }

  /* ---------- 磁带机 ---------- */
  const hoverRadio = () => {
    if (inserted || playing) return
    say(t('Some music, maybe? ♥', '是不是需要来点音乐呢 ♥'), 'radio', 3200)
  }

  const insertTape = () => {
    if (inserted) return
    setInserted(true)
    setBubble(null)
    sfx.insert()
    later(() => {
      const el = audio.current
      if (!el) return
      el.volume = 0.5
      void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    }, 420)
  }

  const toggleMusic = () => {
    const el = audio.current
    if (!el || !inserted) return
    if (el.paused) { void el.play().then(() => setPlaying(true)).catch(() => {}) }
    else { el.pause(); setPlaying(false) }
  }

  /* 拖动磁带：松手时判断有没有落在磁带机上 */
  const dropTape = (event: React.PointerEvent<HTMLElement>) => {
    setDragging(false)
    const el = stage.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    // 磁带机的热区
    if (x > 11 && x < 30 && y > 45 && y < 82) insertTape()
  }

  const earned = () => coinsEarned(state)

  return (
    <section className="arc" aria-label={t('Gachapon arcade', '扭蛋机电玩城')}>
      <audio ref={audio} src={assetUrl('/media/miaozi-jam.mp3')} loop preload="none" />

      <div className={`arc-world ${playing ? 'is-playing' : ''} is-${phase}`} ref={stage}>
        <img className="arc-layer arc-bg" src={img('bg')} alt="" draggable={false} />

        {/* 磁带机 */}
        <div className="arc-radio" onMouseEnter={hoverRadio} onClick={toggleMusic}
          role="button" tabIndex={0} aria-label={t('Cassette player', '磁带机')}
          onKeyDown={(e) => { if (e.key === 'Enter') toggleMusic() }}>
          <img src={img('radio')} alt="" draggable={false} />
          <span className="arc-radio-glow" aria-hidden="true" />
          <span className="arc-notes" aria-hidden="true"><i>♪</i><i>♫</i><i>♥</i></span>
        </div>

        {/* 磁带 */}
        {!inserted && (
          <button
            type="button"
            className={`arc-cassette ${dragging ? 'is-dragging' : ''}`}
            aria-label={t('Pick up the cassette', '拿起磁带')}
            onPointerDown={(e) => { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); setDragging(true); sfx.tick() }}
            onPointerMove={(e) => {
              if (!dragging) return
              const el = e.currentTarget as HTMLElement
              el.style.transform = `translate(${e.clientX - el.offsetLeft - 40}px, ${e.clientY - el.offsetTop - 20}px)`
            }}
            onPointerUp={dropTape}
            onClick={insertTape}
          >
            <img src={img('cassette')} alt="" draggable={false} />
          </button>
        )}

        {/* 扭蛋机 + 可旋转的把手 */}
        <div className="arc-machine" onClick={askSpin} role="button" tabIndex={0}
          aria-label={t('Gachapon machine', '扭蛋机')}
          onKeyDown={(e) => { if (e.key === 'Enter') askSpin() }}>
          <img src={img('machine')} alt="" draggable={false} />
          <img className="arc-handle" src={img('handle')} alt="" draggable={false} />
        </div>

        {/* 少女 */}
        <button className="arc-girl" type="button" onClick={talk} aria-label={t('Talk to her', '和她说话')}>
          <img src={img(bubble?.side === 'girl' ? 'girl-talk' : prize ? 'girl-happy' : 'girl-idle')} alt="" draggable={false} />
        </button>

        {/* 掉出来的扭蛋 */}
        {(phase === 'drop' || phase === 'capsule') && (
          <button className="arc-capsule-ball" type="button" onClick={openCapsule}
            aria-label={t('Open the capsule', '打开扭蛋')}>
            <img src={img(`capsule-${capsule}-closed`)} alt="" draggable={false} />
          </button>
        )}

        {/* 打开的蛋壳 + 手办 */}
        {phase === 'open' && (
          <div className="arc-reveal">
            <div className="arc-figure">
              {prize && <img src={img(prize.file)} alt={prize.name} draggable={false} />}
              <span className="arc-figure-shadow" aria-hidden="true" />
            </div>
            <img className="arc-capsule-open" src={img(`capsule-${capsule}-open`)} alt="" draggable={false} />
          </div>
        )}

        {/* 提示：扭一下 */}
        {phase === 'prompt' && (
          <button className="arc-turn" type="button" onClick={crank}>
            <span>{t('TURN', '扭一下')}</span>
            <i aria-hidden="true">▶</i>
          </button>
        )}

        {/* 气泡 */}
        {bubble && (
          <div className={`arc-bubble is-${bubble.side}`} role="status">
            <span>{bubble.text}</span>
            <i className="arc-bubble-tail" aria-hidden="true" />
          </div>
        )}

        {/* HUD */}
        <div className="arc-hud" aria-live="polite">
          <span className="arc-coin"><i aria-hidden="true">◉</i>{coins}</span>
          <span className="arc-progress">{state.figures.length}<i>/7</i></span>
        </div>

        {/* 收获：古早游戏那种浮在蛋壳上的展示 */}
        {prize && (
          <div className="arc-get">
            <p className="arc-get-line">
              <b>{prize.rare ? t('SECRET!', '隐藏款！') : t('GOT IT!', '获得了！')}</b>
              <span>{prize.name}</span>
            </p>
            <div className="arc-get-actions">
              <button type="button" onClick={() => { sfx.tick(); reset() }}>{t('KEEP', '收下')}</button>
              {coins > 0 && (
                <button type="button" className="ghost" onClick={() => { sfx.tick(); reset(); later(askSpin, 260) }}>
                  {t('AGAIN', '再来一次')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
