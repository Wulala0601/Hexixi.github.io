import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { assetUrl } from './assets'
import {
  airdrop, film, hidden, inspiration, items, meta, philosophy, previous, timeline, values, worldview,
} from './caviar-content'
import './caviar.css'

const STORAGE_KEY = 'caviar.collection.v1'
const HIDDEN_CHANCE = 1 / 60

type Pull = { kind: 'item'; id: string } | { kind: 'hidden' }
type Collection = Record<string, number>

const img = (name: string) => assetUrl(`/images/caviar/${name}.webp`)
const poster = (name: string) => assetUrl(`/images/caviar/${name}.jpg`)

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

function CavFilm() {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
        } else {
          el.pause()
          setPlaying(false)
        }
      }
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const toggle = () => {
    const el = ref.current
    if (!el) return
    if (el.paused) void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    else { el.pause(); setPlaying(false) }
  }

  return (
    <figure className="cav-film">
      <div className="cav-film-frame">
        <video ref={ref} src={assetUrl(film.src)} poster={assetUrl(film.poster)} muted loop playsInline preload="metadata" />
        <button type="button" className="cav-film-toggle" onClick={toggle} aria-label={playing ? '暂停短片' : '播放短片'}>
          <span aria-hidden="true">{playing ? '❚❚' : '▶'}</span>
        </button>
      </div>
      <figcaption>{film.caption}</figcaption>
    </figure>
  )
}

export default function Caviar() {
  const [collection, setCollection] = useState<Collection>({})
  const [drawing, setDrawing] = useState(false)
  const [pull, setPull] = useState<Pull | null>(null)
  const [count, setCount] = useState(0)
  const timer = useRef<number | null>(null)

  useEffect(() => { setCollection(loadCollection()); document.title = '鱼子酱的奇幻夜 — HE XIXI' }, [])
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current) }, [])

  const persist = (next: Collection) => {
    setCollection(next)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* 忽略 */ }
  }

  const draw = () => {
    if (drawing) return
    setDrawing(true)
    setPull(null)

    const roll = Math.random()
    const result: Pull = roll < HIDDEN_CHANCE
      ? { kind: 'hidden' }
      : (() => {
          const pick = Math.random() * 100
          const item = pick < 50 ? items[0] : pick < 80 ? items[1] : items[2]
          return { kind: 'item', id: item.id } as Pull
        })()

    timer.current = window.setTimeout(() => {
      setPull(result)
      setDrawing(false)
      setCount((c) => c + 1)
      const key = result.kind === 'hidden' ? 'hidden' : result.id
      const prev = loadCollection()
      persist({ ...prev, [key]: (prev[key] ?? 0) + 1 })
    }, 950)
  }

  const reset = () => { setPull(null); setCount(0); persist({}) }

  const owned = useMemo(() => items.filter((i) => (collection[i.id] ?? 0) > 0).length, [collection])
  const airdropReady = owned === items.length
  const ownedTotal = 3 + 1 + 1 + 1

  const resultItem = pull?.kind === 'item' ? items.find((i) => i.id === pull.id) ?? null : null

  return (
    <main className="cav">
      {/* ---------- 首屏 ---------- */}
      <section className="cav-hero">
        <img className="cav-deco cav-deco-spider" src={img('spider')} alt="" aria-hidden="true" />
        <img className="cav-deco cav-deco-hat" src={img('hat')} alt="" aria-hidden="true" />
        <div className="cav-hero-inner">
          <p className="cav-kicker">HALLOWEEN LIMITED · NFT COLLECTION · {meta.year}</p>
          <h1>{meta.title.zh}<em>{meta.title.en}</em></h1>
          <p className="cav-sub">{meta.subtitle.zh} · {meta.subtitle.en}</p>
          <ul className="cav-stats">
            <li><strong>{meta.edition.toLocaleString()}</strong><span>限量发行</span></li>
            <li><strong>¥{meta.price}</strong><span>单份定价</span></li>
            <li><strong>03</strong><span>常规款</span></li>
            <li><strong>{meta.platform}</strong><span>发售平台</span></li>
          </ul>
          <div className="cav-actions">
            <a className="cav-btn cav-btn-solid" href="#draw">抽一个盲盒 ↗</a>
            <a className="cav-btn" href="#film">看概念短片</a>
          </div>
        </div>
      </section>

      {/* ---------- 影片 ---------- */}
      <section className="cav-section cav-film-section" id="film">
        <CavFilm />
      </section>

      {/* ---------- 抽盲盒 ---------- */}
      <section className="cav-section cav-draw" id="draw">
        <header className="cav-head">
          <span className="cav-eyebrow">BLIND BOX · 按权重抽取</span>
          <h2>今晚，<em>月亮会给你一只猫</em></h2>
          <p>三款常规款按 50% / 30% / 20% 的权重掉落，另有极低概率抽到隐藏款「鱼子酱」本尊。</p>
        </header>

        <div className="cav-machine">
          <div className={`cav-box-wrap ${drawing ? 'is-shaking' : ''}`}>
            {pull ? (
              <div className="cav-result" key={count}>
                {pull.kind === 'hidden' ? (
                  <>
                    <img className="cav-result-art" src={img('hidden')} alt={hidden.name.zh} />
                    <span className="cav-tag is-hidden">{hidden.name.zh}</span>
                    <p className="cav-result-meta">{hidden.odds} · 隐藏款</p>
                    <p className="cav-result-desc">{hidden.desc.zh}</p>
                  </>
                ) : resultItem ? (
                  <>
                    <img className="cav-result-art" src={img(resultItem.gif)} alt={resultItem.name.zh} />
                    <span className="cav-tag">{resultItem.tag}</span>
                    <h3>{resultItem.name.zh}<em>{resultItem.name.en}</em></h3>
                    <p className="cav-result-meta">{resultItem.rate}% · 全球 {resultItem.edition} 份</p>
                    <p className="cav-result-desc">{resultItem.desc.zh}</p>
                  </>
                ) : null}
              </div>
            ) : (
              <div className="cav-box" aria-hidden="true">
                <div className="cav-box-lid" />
                <div className="cav-box-body">
                  <img src={img('badge')} alt="" />
                  <span>CAVIAR&apos;S FANTASY NIGHT</span>
                </div>
              </div>
            )}
          </div>

          <div className="cav-machine-actions">
            <button className="cav-draw-btn" onClick={draw} disabled={drawing}>
              {drawing ? '抽卡中……' : pull ? '再抽一个' : '抽 一 个'}
            </button>
            <p className="cav-hint" role="status" aria-live="polite">
              {drawing ? '南瓜灯晃了一下……'
                : pull ? `已抽 ${count} 个盲盒 · 图鉴 ${owned} / 3 常规款`
                  : '单抽权重 50 / 30 / 20，隐藏款 1 / 60'}
            </p>
            {count > 0 && <button className="cav-reset" onClick={reset}>清空图鉴</button>}
          </div>
        </div>

        <div className="cav-index">
          <div className="cav-index-head">
            <span className="cav-eyebrow">图鉴 / COLLECTION</span>
            <span className="cav-index-count">{owned + (airdropReady ? 1 : 0) + 1 + (collection.hidden ? 1 : 0)} / {ownedTotal}</span>
          </div>
          <div className="cav-index-grid">
            {items.map((item) => {
              const got = (collection[item.id] ?? 0) > 0
              return (
                <figure key={item.id} className={`cav-slot ${got ? 'is-got' : ''}`}>
                  <div className="cav-slot-art">
                    <img src={poster(item.poster)} alt={got ? item.name.zh : '未解锁'} loading="lazy" />
                    <img className="cav-slot-frame" src={img('frame')} alt="" aria-hidden="true" loading="lazy" />
                  </div>
                  <figcaption>
                    <strong>{got ? item.name.zh : '???'}</strong>
                    <small>{item.rate}% · {item.edition} 份</small>
                    {(collection[item.id] ?? 0) > 1 && <em className="cav-dupe">×{collection[item.id]}</em>}
                  </figcaption>
                </figure>
              )
            })}

            <figure className={`cav-slot ${airdropReady ? 'is-got' : 'is-locked'}`}>
              <div className="cav-slot-art">
                <img src={poster(airdrop.poster)} alt={airdropReady ? airdrop.name.zh : '空投未解锁'} loading="lazy" />
                <img className="cav-slot-frame" src={img('frame')} alt="" aria-hidden="true" loading="lazy" />
              </div>
              <figcaption>
                <strong>{airdropReady ? airdrop.name.zh : '？？？'}</strong>
                <small>{airdropReady ? '空投资格已获得' : `集齐 ${owned}/3 + 往期`}</small>
              </figcaption>
            </figure>

            <figure className="cav-slot is-got">
              <div className="cav-slot-art">
                <img src={img('previous')} alt={previous.name.zh} loading="lazy" />
                <img className="cav-slot-frame" src={img('frame')} alt="" aria-hidden="true" loading="lazy" />
              </div>
              <figcaption>
                <strong>{previous.name.zh}</strong>
                <small>往期藏品 · 已持有</small>
              </figcaption>
            </figure>

            <figure className={`cav-slot ${collection.hidden ? 'is-got' : 'is-locked'}`}>
              <div className="cav-slot-art">
                <img src={img('hidden')} alt={collection.hidden ? hidden.name.zh : '隐藏款未解锁'} loading="lazy" />
                <img className="cav-slot-frame" src={img('frame')} alt="" aria-hidden="true" loading="lazy" />
              </div>
              <figcaption>
                <strong>{collection.hidden ? hidden.name.zh : '？？？'}</strong>
                <small>{hidden.odds} · 隐藏款</small>
              </figcaption>
            </figure>
          </div>
          <p className="cav-note">
            空投规则：集齐《幽灵舞会领舞者》《破壳小魔女》《魔药小学徒》三款，加上往期藏品《蛛蜜惊糖》，
            可获得空投奖励《奇幻夜巡游》。这是实际发行时的机制，页面里的抽取只是演示。
          </p>
        </div>
      </section>

      {/* ---------- 发行方案 ---------- */}
      <section className="cav-section cav-release">
        <header className="cav-head">
          <span className="cav-eyebrow">DISTRIBUTION · 发行方案</span>
          <h2>3500 份，<em>18 元一份</em></h2>
          <p>以个人空间展台与摆件为主要切入点，上架鲸探 App 发售。</p>
        </header>

        <table className="cav-table">
          <thead><tr><th>款型</th><th>概率</th><th>份数</th><th>说明</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <th scope="row">{item.name.zh}</th>
                <td>{item.rate}%</td>
                <td>{item.edition}</td>
                <td>{item.tag}</td>
              </tr>
            ))}
            <tr>
              <th scope="row">奇幻夜巡游（空投）</th>
              <td>不单独抽取</td>
              <td>按集齐发放</td>
              <td>三款 + 往期《蛛蜜惊糖》</td>
            </tr>
          </tbody>
        </table>

        <div className="cav-timeline">
          {timeline.map((step) => (
            <div key={step.label.zh}>
              <span className="cav-eyebrow">{step.label.zh}</span>
              <p>{step.text.zh}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- IP 设定 ---------- */}
      <section className="cav-section cav-ip">
        <header className="cav-head">
          <span className="cav-eyebrow">IP · 设定与来源</span>
          <h2>一只猫，<em>和一个哥特的十月</em></h2>
        </header>
        <div className="cav-cols">
          <article>
            <h3>灵感来源</h3>
            <p>{inspiration.zh}</p>
          </article>
          <article>
            <h3>世界观</h3>
            <p>{worldview.zh}</p>
          </article>
          <article>
            <h3>设计哲学</h3>
            <p>{philosophy.zh}</p>
          </article>
        </div>
        <img className="cav-ornament" src={img('ornament')} alt="" aria-hidden="true" />
      </section>

      {/* ---------- 三款产品 ---------- */}
      <section className="cav-section cav-items">
        <header className="cav-head">
          <span className="cav-eyebrow">THE THREE · 常规款档案</span>
          <h2>三只猫，<em>三种夜晚</em></h2>
        </header>
        {items.map((item, index) => (
          <article className="cav-item" key={item.id}>
            <div className="cav-item-art">
              <img src={img(item.gif)} alt={item.name.zh} loading="lazy" />
            </div>
            <div className="cav-item-body">
              <span className="cav-num">{String(index + 1).padStart(2, '0')} · {item.rate}%</span>
              <h3>{item.name.zh}<em>{item.name.en}</em></h3>
              <p>{item.desc.zh}</p>
              <p className="cav-item-en">{item.desc.en}</p>
            </div>
          </article>
        ))}
      </section>

      {/* ---------- 价值体现 ---------- */}
      <section className="cav-section cav-values">
        <header className="cav-head">
          <span className="cav-eyebrow">VALUE · 价值体现</span>
          <h2>为什么是<em>展台</em>，为什么是<em>图鉴</em></h2>
        </header>
        <div className="cav-values-grid">
          {values.map((value) => (
            <article key={value.title.zh}>
              <h3>{value.title.zh}<em>{value.title.en}</em></h3>
              <p>{value.text.zh}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="cav-end">
        <p className="cav-end-title">万圣节见。</p>
        <p className="cav-end-line">{meta.title.zh} · {meta.edition.toLocaleString()} 份 · ¥{meta.price} · {meta.platform}</p>
        <Link className="cav-btn cav-btn-solid" to="/#worlds">回到六个世界 ↗</Link>
      </footer>
    </main>
  )
}
