import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { assetUrl } from './assets'
import { atbImageName } from './atb505-utils'
import { cast, doors, hidden, type CastId, type WorldId } from './atb505-content'

const STORAGE_KEY = 'atb505.collection.v1'
const HIDDEN_CHANCE = 1 / 24

type Pull = { id: CastId | 'bug'; world: WorldId; hidden: boolean }

type Collection = Record<string, number>

function loadCollection(): Collection {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? (parsed as Collection) : {}
  } catch {
    return {}
  }
}

export default function BlindBox() {
  const [world, setWorld] = useState<WorldId>('tang')
  const [drawing, setDrawing] = useState(false)
  const [pull, setPull] = useState<Pull | null>(null)
  const [collection, setCollection] = useState<Collection>({})
  const [count, setCount] = useState(0)
  const timer = useRef<number | null>(null)

  useEffect(() => setCollection(loadCollection()), [])
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current) }, [])

  const persist = useCallback((next: Collection) => {
    setCollection(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* 隐私模式下忽略 */
    }
  }, [])

  const draw = () => {
    if (drawing) return
    setDrawing(true)
    setPull(null)
    const roll = Math.random()
    const isHidden = world === 'neon' && roll < HIDDEN_CHANCE
    const castIds: CastId[] = ['laogu', 'jian', 'li', 'nafu']
    const picked: CastId | 'bug' = isHidden
      ? 'bug'
      : castIds[Math.floor(Math.random() * castIds.length)]
    timer.current = window.setTimeout(() => {
      const next: Pull = { id: picked, world, hidden: isHidden }
      setPull(next)
      setDrawing(false)
      setCount((c) => c + 1)
      const key = `${world}:${picked}`
      const prev = loadCollection()
      persist({ ...prev, [key]: (prev[key] ?? 0) + 1 })
    }, 900)
  }

  const reset = () => {
    setPull(null)
    setCount(0)
    persist({})
  }

  const owned = useMemo(() => Object.keys(collection).length, [collection])
  const total = doors.length * 4 + 1

  const resultCast = pull && pull.id !== 'bug' ? cast.find((c) => c.id === pull.id) : null
  const resultImage = pull
    ? assetUrl(`/images/atb/${atbImageName(pull.world, pull.id)}.webp`)
    : ''

  const worldIndex = doors.findIndex((d) => d.id === world)

  return (
    <section className="atb-draw" id="draw">
      <header className="atb-section-head">
        <span className="atb-eyebrow">第一弹 · 一盒一世界</span>
        <h2>抽一盒，<em>掉进</em>一条世界线</h2>
        <p>
          一条世界线 = 一套主题盲盒 = 四款常规 + 一款隐藏。选一条世界线，摇一摇，
          看看这次是谁陪你走进这段历史。
        </p>
      </header>

      <div className="atb-machine">
        <div className={`atb-box-stage ${drawing ? 'is-shaking' : ''} ${pull ? 'is-open' : ''}`}>
          <div className="atb-box" aria-hidden="true">
            <div className="atb-box-lid" />
            <div className="atb-box-body">
              <img src={assetUrl('/images/atb/logo.webp')} alt="" />
              <span>一盒一世界</span>
            </div>
          </div>
          {pull && (
            <figure className="atb-result" key={`${pull.world}-${pull.id}-${count}`}>
              <div className={`atb-result-art ${pull.hidden ? 'is-hidden' : ''}`}>
                <img src={resultImage} alt={pull.hidden ? hidden.name : resultCast?.name ?? ''} />
              </div>
              <figcaption>
                <span className={`atb-rarity ${pull.hidden ? 'is-hidden' : ''}`}>
                  {pull.hidden ? '隐藏款 · 1 / 24' : '常规款'}
                </span>
                <strong>{pull.hidden ? hidden.name : resultCast?.name}</strong>
                <small>{doors[worldIndex].name} · {pull.hidden ? hidden.title : resultCast?.skins.find((s) => s.world === world)?.look}</small>
                <p>{pull.hidden ? hidden.quote : resultCast?.quote}</p>
              </figcaption>
            </figure>
          )}
        </div>

        <div className="atb-machine-actions">
          <div className="atb-world-tabs" role="tablist" aria-label="选择世界线">
            {doors.map((door, i) => (
              <button
                key={door.id}
                role="tab"
                aria-selected={world === door.id}
                className={`atb-world-tab ${world === door.id ? 'is-active' : ''}`}
                onClick={() => { setWorld(door.id); setPull(null) }}
              >
                <span className="atb-world-code">{String(i + 1).padStart(2, '0')}</span>
                <strong>{door.name}</strong>
                <small>{door.type}</small>
              </button>
            ))}
          </div>
          <button className="atb-draw-btn" onClick={draw} disabled={drawing}>
            {drawing ? '摇盒中……' : pull ? '再抽一盒' : '抽 一 盒'}
          </button>
          <p className="atb-hint" role="status" aria-live="polite">
            {drawing
              ? '盒子里有声音……'
              : pull
                ? `${doors[worldIndex].name} · 已抽 ${count} 盒 · 图鉴 ${owned} / ${total}`
                : '常规 4 款随机 · 霓虹地下城有 1 / 24 概率遇见隐藏款 BUG 浣熊'}
          </p>
          {count > 0 && (
            <button className="atb-reset" onClick={reset}>清空图鉴，重新开始</button>
          )}
        </div>
      </div>

      <div className="atb-collection">
        <div className="atb-collection-head">
          <span className="atb-eyebrow">图鉴 / COLLECTION</span>
          <span className="atb-collection-count">{owned} / {total}</span>
        </div>
        <div className="atb-collection-grid">
          {doors.map((door) =>
            cast.map((member) => {
              const key = `${door.id}:${member.id}`
              const got = collection[key] > 0
              return (
                <figure key={key} className={`atb-slot ${got ? 'is-got' : ''}`} title={got ? `${member.name} · 已拥有 ×${collection[key]}` : undefined}>
                  <img
                    src={assetUrl(`/images/atb/${atbImageName(door.id, member.id)}.webp`)}
                    alt={got ? `${door.name} · ${member.name}` : '未解锁'}
                    loading="lazy"
                  />
                  <figcaption>
                    <strong>{got ? member.name : '？？？'}</strong>
                    <small>{door.name}</small>
                    {collection[key] > 1 && <em className="atb-dupe">×{collection[key]}</em>}
                  </figcaption>
                </figure>
              )
            }),
          )}
          <figure className={`atb-slot atb-slot-hidden ${collection[`neon:bug`] > 0 ? 'is-got' : ''}`}>
            <img
              src={assetUrl('/images/atb/' + atbImageName('neon', 'bug') + '.webp')}
              alt={collection['neon:bug'] > 0 ? hidden.name : '未解锁隐藏款'}
              loading="lazy"
            />
            <figcaption>
              <strong>{collection['neon:bug'] > 0 ? hidden.name : '？？？'}</strong>
              <small>隐藏款</small>
              {collection['neon:bug'] > 1 && <em className="atb-dupe">×{collection['neon:bug']}</em>}
            </figcaption>
          </figure>
        </div>
        <p className="atb-collection-note">
          重复款会记次数——现实中，它们会被送进「交换广场」和别人换掉。
        </p>
      </div>
    </section>
  )
}
