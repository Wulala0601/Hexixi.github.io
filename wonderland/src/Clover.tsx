import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { assetUrl } from './assets'
import './clover.css'

const img = (name: string) => assetUrl(`/images/clover/${name}.webp`)

/** 考古现场的道具：位置是相对底图的百分比 */
const PROPS = [
  { id: 'prop-08', x: 1, y: 0, w: 11, step: 0, zh: '棉手套', en: 'Gloves' },
  { id: 'prop-11', x: 2, y: 33, w: 9, step: 3, zh: '油画刷', en: 'Brush' },
  { id: 'prop-09', x: 3, y: 61, w: 9, step: 1, zh: '木刮刀', en: 'Wooden rib' },
  { id: 'prop-10', x: 12, y: 32, w: 8, step: 0, zh: '尖嘴钳', en: 'Pliers' },
  { id: 'prop-01', x: 10, y: 49, w: 15, step: 0, zh: '铁丝骨架', en: 'Wire armature' },
  { id: 'prop-02', x: 24, y: 70, w: 10, step: 0, zh: '手中骨架', en: 'Armature in hand' },
  { id: 'prop-03', x: 17, y: 1, w: 12, step: 1, zh: '上泥初坯', en: 'Clay base' },
  { id: 'prop-05', x: 44, y: 0, w: 12, step: 1, zh: '锡纸包覆', en: 'Foil wrap' },
  { id: 'prop-12', x: 32, y: 11, w: 27, step: 2, zh: '成品 · 四叶草抱盆', en: 'Finished piece' },
  { id: 'prop-04', x: 63, y: 29, w: 12, step: 1, zh: '铁丝花瓣', en: 'Wire petals' },
  { id: 'prop-06', x: 61, y: 60, w: 12, step: 3, zh: '上色中的坯体', en: 'Painting stage' },
  { id: 'prop-07', x: 76, y: 14, w: 16, step: 2, zh: '双手底座', en: 'Hands base' },
]

const STEPS = [
  {
    en: 'Frameword Construction',
    zh: '骨架搭建',
    text: '用 3mm 铁丝做出有动势的骨架，再用锡纸缠绕塑形，建立扎实的地基。',
    enText: 'Used 3mm iron wire to create a dynamic armature, wrapped and shaped with tin foil to establish a solid foundation.',
  },
  {
    en: 'Clay Sculpting',
    zh: '上泥塑形',
    text: '在骨架上覆石塑黏土，一点点刻出手套的缝线与管道的螺栓。',
    enText: 'Covered the armature with stone clay, meticulously carving details such as the gloves’ stitching and the pipe’s bolts.',
  },
  {
    en: 'Natural Drying',
    zh: '自然阴干',
    text: '室温下缓慢阴干，让材料彻底固化——这一步决定了它会不会裂。',
    enText: 'Allowed the piece to air-dry slowly at room temperature, ensuring complete curing and preventing cracks.',
  },
  {
    en: 'Texture Presentation',
    zh: '肌理呈现',
    text: '保留石塑黏土本身的质感，让手工痕迹和雕塑感自己说话。',
    enText: 'Preserved the essential material beauty of the stone clay, highlighting the pure, handmade traces and sculptural sensibility.',
  },
]

const MATS = [
  { file: 'mat-01', zh: '陶瓷', en: 'Ceramic' },
  { file: 'mat-02', zh: '金属', en: 'Metal' },
  { file: 'mat-03', zh: '石膏', en: 'Plaster' },
  { file: 'mat-04', zh: '麂皮', en: 'Suede' },
  { file: 'mat-05', zh: '玉石', en: 'Jade' },
  { file: 'mat-06', zh: '玻璃', en: 'Glass' },
  { file: 'mat-07', zh: '木头', en: 'Wood' },
  { file: 'mat-08', zh: '气球', en: 'Balloon' },
  { file: 'mat-09', zh: '针织', en: 'Knitted Wool' },
  { file: 'mat-10', zh: '大理石', en: 'Marble' },
]

export default function Clover() {
  const [dug, setDug] = useState<string[]>([])
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    document.title = '请躺在这里 — HE XIXI'
    return () => { document.title = 'HE XIXI — Soft Error Wonderland' }
  }, [])

  useEffect(() => {
    if (paused) return
    timer.current = window.setInterval(() => setActive((i) => (i + 1) % MATS.length), 2400)
    return () => { if (timer.current) window.clearInterval(timer.current) }
  }, [paused])

  const dig = (id: string) => setDug((list) => (list.includes(id) ? list : [...list, id]))
  const reset = () => setDug([])

  const lastDug = dug.length ? PROPS.find((p) => p.id === dug[dug.length - 1]) : null
  const activeStep = lastDug ? lastDug.step : -1

  return (
    <main className="clo">
      {/* 朦胧光效层 */}
      <div className="clo-atmosphere" aria-hidden="true">
        <span className="clo-beam clo-beam-1" />
        <span className="clo-beam clo-beam-2" />
        <span className="clo-beam clo-beam-3" />
        <span className="clo-glow" />
        <span className="clo-motes" />
      </div>

      {/* ---------- 首屏 ---------- */}
      <section className="clo-hero">
        <figure className="clo-hero-media">
          <img src={img('hero-band')} alt="夜里长满植物的房间，双手捧着的四叶草装置" />
          <figcaption>PLEASE LIE HERE · 装置场景</figcaption>
        </figure>
        <div className="clo-hero-inner">
          <p className="clo-kicker">SPATIAL NARRATIVE · MATERIAL STUDY · 2025</p>
          <div className="clo-title-lockup">
            <h1>请躺在这里</h1>
            <img className="clo-title-logo" src={img('icon-hands')} alt="四叶草抱盆标志" />
          </div>
          <p className="clo-title-en">PLEASE LIE HERE</p>
          <p className="clo-lede">
            一件让人躺下来休息的装置。双手捧着一小片会发光的草地——它不在任何花园里，
            却在你终于愿意停下来的那一刻出现。
          </p>
          <div className="clo-actions">
            <a className="clo-btn clo-btn-solid" href="#dig">走进考古现场 ↗</a>
            <a className="clo-btn" href="#render">看材质渲染</a>
          </div>
        </div>
      </section>

      {/* ---------- 灵感 ---------- */}
      <section className="clo-section clo-split">
        <figure className="clo-figure">
          <img src={img('slide-inspiration')} alt="灵感板：植物、四叶草与童年动画" loading="lazy" />
        </figure>
        <div className="clo-copy">
          <span className="clo-eyebrow">01 · INSPIRATION</span>
          <h2>把<em>一小片草地</em>搬进房间</h2>
          <p>
            灵感来自四叶草、苔藓和那些被我们塞进玻璃罐的小植物——还有童年动画里，
            那种"手一张开就会有光"的瞬间。
          </p>
          <p className="clo-copy-en">
            A four-leaf clover, some moss, and the childhood animation moment when a hand opens and light comes out.
          </p>
        </div>
      </section>

      {/* ---------- 概念 ---------- */}
      <section className="clo-section clo-split clo-split-reverse">
        <div className="clo-copy">
          <span className="clo-eyebrow">02 · CONCEPT EXPLORATION</span>
          <h2>试管、3D 打印，<em>和一双托住的手</em></h2>
          <p>
            概念阶段试了很多容器：试管、培养皿、打印件。最后留下的是一双手——
            因为"被托住"才是休息真正的条件。
          </p>
          <p className="clo-copy-en">
            Test tubes, petri dishes, printed shells. What stayed was the pair of hands: being held is the actual condition of rest.
          </p>
        </div>
        <figure className="clo-figure clo-figure-sketch">
          <img src={img('sketch-white')} alt="手绘草图：四角星、椅背与马里奥水管的标注" loading="lazy" />
        </figure>
      </section>

      {/* ---------- 考古现场 ---------- */}
      <section className="clo-section clo-dig" id="dig">
        <header className="clo-head">
          <span className="clo-eyebrow">03 · PRODUCTION SITE</span>
          <h2>一块<em>假的考古现场</em></h2>
          <p>
            它看起来像刚被挖开的土层，其实是我做这件装置的全过程：骨架、上泥、阴干、上色，和用到的工具。
            点一下散落的物件，把它们一件件"发掘"出来。
          </p>
        </header>

        <div className="clo-dig-stage" style={{ backgroundImage: `url(${img('dig-bg')})` }}>
          {PROPS.map((prop) => {
            const isDug = dug.includes(prop.id)
            return (
              <button
                key={prop.id}
                type="button"
                className={`clo-prop ${isDug ? 'is-dug' : ''} ${lastDug?.id === prop.id ? 'is-last' : ''}`}
                style={{ left: `${prop.x}%`, top: `${prop.y}%`, width: `${prop.w}%` }}
                onClick={() => dig(prop.id)}
                aria-pressed={isDug}
                aria-label={`${prop.zh} ${prop.en}`}
              >
                <img src={img(prop.id)} alt="" loading="lazy" />
                <span className="clo-prop-tag">{prop.zh}<em>{prop.en}</em></span>
              </button>
            )
          })}

          <p className="clo-dig-counter" role="status" aria-live="polite">
            已发掘 {dug.length} / {PROPS.length}
          </p>
        </div>

        <div className="clo-dig-panel">
          <div className="clo-steps">
            {STEPS.map((step, i) => (
              <article key={step.en} className={activeStep === i ? 'is-active' : ''}>
                <span className="clo-step-no">{String(i + 1).padStart(2, '0')}</span>
                <h3>{step.zh}<em>{step.en}</em></h3>
                <p>{step.text}</p>
                <p className="clo-step-en">{step.enText}</p>
              </article>
            ))}
          </div>
          <div className="clo-dig-actions">
            <button type="button" className="clo-btn" onClick={reset} disabled={!dug.length}>重新掩埋</button>
            <p>{lastDug ? `刚刚出土：${lastDug.zh}` : '从左上角的手套开始也行。'}</p>
          </div>
        </div>
      </section>

      {/* ---------- 材质渲染 ---------- */}
      <section className="clo-section clo-render" id="render">
        <header className="clo-head">
          <span className="clo-eyebrow">04 · RENDERINGS</span>
          <h2>同一件东西，<em>十种材料</em></h2>
          <p>
            用 AI 把原始模型做成多材质渲染，看它在不同触感下会变成什么。画面会自己走，
            也可以点下面的材质停下来看。
          </p>
        </header>

        <div
          className="clo-render-stage"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {MATS.map((mat, i) => (
            <img
              key={mat.file}
              src={img(mat.file)}
              alt={`${mat.zh}材质渲染`}
              loading={i === 0 ? 'eager' : 'lazy'}
              className={i === active ? 'is-on' : ''}
              style={{ '--i': i } as React.CSSProperties}
            />
          ))}
          <div className="clo-render-label">
            <span>{String(active + 1).padStart(2, '0')}</span>
            <strong>{MATS[active].zh}<em>{MATS[active].en}</em></strong>
          </div>
        </div>

        <div className="clo-chips" role="group" aria-label="选择材质">
          {MATS.map((mat, i) => (
            <button
              key={mat.file}
              type="button"
              className={i === active ? 'is-on' : ''}
              onClick={() => { setActive(i); setPaused(true) }}
            >
              {mat.zh}
            </button>
          ))}
        </div>

        <div className="clo-render-foot">
          <figure>
            <img src={img('mat-painted')} alt="丙烯上色的原始版本" loading="lazy" />
            <figcaption>原始版本 · 丙烯上色<em>Colored with acrylic paints</em></figcaption>
          </figure>
          <p>
            渲染只是推演。真正做出来的只有左边这一件：石塑黏土、丙烯、一根 3mm 铁丝，
            和一双被泥弄得发白的手。
          </p>
        </div>
      </section>

      {/* ---------- 虚拟展 ---------- */}
      <section className="clo-section clo-exhibit">
        <figure className="clo-figure">
          <img src={img('slide-exhibit')} alt="虚拟展厅：夜色中的发光装置" loading="lazy" />
        </figure>
        <div className="clo-copy">
          <span className="clo-eyebrow">05 · VIRTUAL EXHIBITION</span>
          <h2>在展厅里，<em>它自己会发光</em></h2>
          <p>
            虚拟展把装置放进一片夜里的植物园：观众走进去，光圈亮起来，
            四叶草像一盏很小的灯。这一刻不需要讲解。
          </p>
        </div>
      </section>

      <footer className="clo-end">
        <img className="clo-end-icon" src={img('icon-hands')} alt="" aria-hidden="true" loading="lazy" />
        <p className="clo-end-line">躺下来，光会自己找过来。</p>
        <p className="clo-end-meta">Please Lie Here · Spatial narrative / Material study · 2025</p>
        <Link className="clo-btn clo-btn-solid" to="/#worlds">回到六个世界 ↗</Link>
      </footer>
    </main>
  )
}
