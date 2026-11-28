import { useEffect, useRef, useState } from 'react'
import { assetUrl } from './assets'
import { usePreferences } from './preferences'
import {
  FIGURES, coinsEarned, coinsLeft, getGacha, pullFigure, subscribe,
  type Figure, type GachaState,
} from './gacha-progress'
import './gacha-arcade.css'

const img = (name: string) => assetUrl(`/images/gacha/${name}.webp`)

const CAPSULES = ['mint', 'pink', 'red', 'forest', 'sky', 'brown'] as const

type Phase = 'idle' | 'shake' | 'drop' | 'open' | 'reveal'

export default function GachaArcade() {
  const { t } = usePreferences()
  const [state, setState] = useState<GachaState>(getGacha)
  const [phase, setPhase] = useState<Phase>('idle')
  const [bubble, setBubble] = useState<string | null>(null)
  const [prize, setPrize] = useState<Figure | null>(null)
  const [capsule, setCapsule] = useState<string>('pink')
  const [line, setLine] = useState(0)
  const [playing, setPlaying] = useState(false)
  const audio = useRef<HTMLAudioElement>(null)
  const timers = useRef<number[]>([])

  useEffect(() => subscribe(() => setState(getGacha())), [])

  useEffect(() => () => { timers.current.forEach((id) => window.clearTimeout(id)) }, [])

  const coins = coinsLeft(state)
  const earned = coinsEarned(state)

  const say = (text: string, ms = 5200) => {
    setBubble(text)
    const id = window.setTimeout(() => setBubble(null), ms)
    timers.current.push(id)
  }

  /** 点少女：还没有硬币就求助，有了就催你抽 */
  const talk = () => {
    const lines = coins > 0
      ? [
        t('You have coins! Try the machine, I want that whole series.', '你拿到硬币了！快去扭蛋机试试，我想集齐这一整套。'),
        t('One pull? Just one? Please.', '就抽一次？就一次嘛。'),
      ]
      : earned >= 6
        ? [t('All six doors? Then you have six coins — go on, spin it!', '六扇门都看完了？那你手上有六枚硬币，快转一下！')]
        : [
          t('I want to collect this whole series, but I have no coins. Can you help me?', '我想收集这个系列的扭蛋，但是我没有硬币，你能帮帮我吗？'),
          t('Maybe look inside the doors below — you might find some coins there.', '或许你去下面的门里找找就能获得一些硬币了 ↓'),
        ]
    say(lines[line % lines.length])
    setLine((v) => v + 1)
  }

  /** 点扭蛋机：抽一次 */
  const spin = () => {
    if (phase !== 'idle') return
    if (coins <= 0) {
      say(earned >= 6
        ? t('No coins left. Open the last door downstairs?', '硬币用完了…下面的门还有一扇没看？')
        : t('No coins yet — the doors downstairs have some.', '还没有硬币，下面的门里有 ↓'))
      return
    }
    const result = pullFigure()
    if (!result) return
    setCapsule(CAPSULES[Math.floor(Math.random() * CAPSULES.length)])
    setPhase('shake')
    timers.current.push(window.setTimeout(() => setPhase('drop'), 850))
    timers.current.push(window.setTimeout(() => setPhase('open'), 1500))
    timers.current.push(window.setTimeout(() => {
      setPhase('reveal')
      setPrize(result)
    }, 2100))
  }

  const closePrize = () => {
    setPrize(null)
    setPhase('idle')
  }

  /** 点收音机：播放 / 暂停 */
  const toggleMusic = () => {
    const el = audio.current
    if (!el) return
    if (el.paused) {
      el.volume = 0.55
      void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    } else {
      el.pause()
      setPlaying(false)
    }
  }

  const girlFrame = phase === 'reveal' || prize ? 'girl-happy' : bubble ? 'girl-talk' : 'girl-idle'

  return (
    <section className="arc" id="awakening" aria-label={t('Gachapon arcade', '扭蛋机小场景')}>
      <audio ref={audio} src={assetUrl('/media/miaozi-jam.mp3')} loop preload="none" />

      <div className="arc-head">
        <p className="arc-eyebrow">HE XIXI · GACHAPON ARCADE</p>
        <h1 className="arc-title">
          {t('Six worlds,', '六个世界，')}<em>{t('seven figurines.', '七个小手办。')}</em>
        </h1>
        <p className="arc-sub">
          {t('Read the six doors below to earn coins, then come back and spin.', '读完下面六扇门可以拿到硬币，回来扭蛋机抽手办。')}
        </p>
      </div>

      <div className={`arc-stage ${playing ? 'is-playing' : ''} ${phase !== 'idle' ? `is-${phase}` : ''}`}>
        <img className="arc-layer arc-bg" src={img('bg')} alt="" draggable={false} />

        <button className="arc-radio" type="button" onClick={toggleMusic} aria-pressed={playing}
          aria-label={playing ? t('Pause the music', '暂停音乐') : t('Play the music', '播放音乐')}>
          <img src={img('radio')} alt="" draggable={false} />
          <span className="arc-radio-glow" aria-hidden="true" />
          <span className="arc-notes" aria-hidden="true"><i>♪</i><i>♫</i><i>♪</i></span>
          <span className="arc-radio-label">{playing ? t('playing', '播放中') : t('tap for music', '点我听歌')}</span>
        </button>

        <button className="arc-machine" type="button" onClick={spin}
          aria-label={t('Spin the gachapon machine', '转动扭蛋机')}>
          <img src={img('machine')} alt="" draggable={false} />
          <span className="arc-machine-glow" aria-hidden="true" />
          <span className="arc-machine-hint">{coins > 0 ? `${coins} ${t('coins', '枚')}` : t('need a coin', '缺硬币')}</span>
        </button>

        <button className={`arc-girl ${bubble ? 'is-talking' : ''}`} type="button" onClick={talk}
          aria-label={t('Talk to the catgirl', '和她说话')}>
          <img src={img(girlFrame)} alt="" draggable={false} />
        </button>

        {bubble && (
          <div className="arc-bubble" role="status">
            <span>{bubble}</span>
            <i className="arc-bubble-tail" aria-hidden="true" />
          </div>
        )}

        {phase === 'drop' && <img className="arc-capsule fly" src={img(`capsule-${capsule}-closed`)} alt="" />}
        {phase === 'open' && <img className="arc-capsule open" src={img(`capsule-${capsule}-open`)} alt="" />}
        {phase === 'reveal' && prize && (
          <img className="arc-capsule reveal" src={img(prize.file)} alt="" />
        )}
      </div>

      <div className="arc-hud">
        <span className="arc-coins" aria-live="polite">
          <b>{coins}</b> {t('coins', '枚硬币')}
          <small>· {t('earned', '已获得')} {earned}/7</small>
        </span>
        <span className="arc-collected">
          {t('collected', '已收集')} {state.figures.length}/7
        </span>
      </div>

      <ul className="arc-shelf" aria-label={t('Collection', '收集册')}>
        {FIGURES.map((f) => {
          const owned = state.figures.includes(f.key)
          return (
            <li key={f.key} className={`${owned ? 'is-owned' : ''} ${f.rare ? 'is-rare' : ''}`}>
              {owned
                ? <img src={img(f.file)} alt={f.name} />
                : <span aria-hidden="true">?</span>}
              <em>{owned ? f.name : t('locked', '未获得')}</em>
            </li>
          )
        })}
      </ul>

      {prize && (
        <div className="arc-modal" role="dialog" aria-modal="true" aria-label={prize.name}>
          <div className={`arc-card ${prize.rare ? 'is-rare' : ''}`}>
            <p className="arc-card-kicker">{prize.rare ? t('SECRET FIGURE', '隐藏款 · 超级稀有') : t('YOU GOT', '你抽到了')}</p>
            <img src={img(prize.file)} alt={prize.name} />
            <h2>{prize.name}</h2>
            <p className="arc-card-note">{prize.note}</p>
            <div className="arc-card-actions">
              <button type="button" onClick={closePrize}>{t('Nice', '收下')}</button>
              {coins > 0 && <button type="button" className="ghost" onClick={() => { closePrize(); window.setTimeout(spin, 220) }}>
                {t('Spin again', '再抽一次')}
              </button>}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
