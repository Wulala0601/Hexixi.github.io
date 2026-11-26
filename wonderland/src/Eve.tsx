import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { assetUrl } from './assets'
import './eve.css'

const img = (name: string) => assetUrl(`/images/eve/${name}.webp`)

const VOICE = [
  { zh: '这不是关于一个枕头的故事。', en: 'This is not a story about a pillow.' },
  { zh: '是关于某个普通下午，从垃圾通道消失的云。', en: 'It is about the cloud that disappeared down a trash chute one ordinary afternoon.' },
  { zh: '是关于那些被他人定义为「破布」的，二十三年的指纹。', en: 'About twenty-three years of fingerprints, redefined by someone else as “just an old rag”.' },
  { zh: '他们叫我长大。所以我任由他们带走了它。', en: 'They told me to grow up. So I let them take it away.' },
  { zh: '但某些深夜，我的手臂仍会不自觉环抱成那个弧度——抱着早已不存在的它。', en: 'But sometimes, in the dark, my arms still form the shape of holding something that isn’t there.' },
]

const OBJECTS = [
  { file: 'spike', title: '尖刺抱枕', en: 'The spiked pillow', text: '柔软的棉花长出一圈硬刺。靠近它，就要先被扎一下——这正是依恋的形状。' },
  { file: 'heart', title: '心形相框', en: 'Heart frame', text: '粉与紫的糖纸上嵌着一枚小小的心，像童年贴在墙上的那种塑料亮片。' },
  { file: 'bag', title: '珠绣手提包', en: 'Beaded bag', text: '缝满珠片与假花的手袋，是把「舍不得扔」穿在身上的方式。' },
  { file: 'clay', title: '黏土刺虫', en: 'Clay spike', text: '一团被反复捏过的白色黏土，长出软软的刺，像某种不肯成形的记忆。' },
  { file: 'glitch', title: '故障的脸', en: 'Glitched face', text: '蓝色的数据块遮住脸——当柔软被看见，第一反应是把自己打码。' },
]

const INSTALL = [
  { file: 'install-1', caption: '展厅一角：蓝色投影覆过墙面与观众' },
  { file: 'install-2', caption: '装置与影像同步运行，水母与星在墙上游动' },
  { file: 'install-3', caption: '装置应用示意：影像、投影与实体的关系' },
  { file: 'install-4', caption: '分解图：柔软体如何被数据云吞掉' },
  { file: 'install-5', caption: '现场：观众走进投影里的「海底」' },
  { file: 'install-6', caption: 'Today is no holds barred' },
]

const JOURNALS = [
  { file: 'journal-1', caption: '手稿 01 · 关于「要丢掉的东西」的笔记' },
  { file: 'journal-2', caption: '手稿 02 · 糖果色与涂鸦的庇护所' },
  { file: 'journal-3', caption: '手稿 03 · 被划掉的句子' },
  { file: 'journal-4', caption: '手稿 04 · 黑色爆炸与数字噪点' },
]

export default function OnTheEve() {
  const video = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [spiked, setSpiked] = useState(true)

  useEffect(() => {
    document.title = '在崩解前夕 — HE XIXI'
    return () => { document.title = 'HE XIXI — Soft Error Wonderland' }
  }, [])

  const play = () => {
    const el = video.current
    if (!el) return
    if (el.paused) void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    else { el.pause(); setPlaying(false) }
  }

  return (
    <main className="eve">
      {/* ---------- 首屏 ---------- */}
      <section className="eve-hero">
        <img className="eve-float eve-float-a" src={img('sticker-1')} alt="" aria-hidden="true" />
        <img className="eve-float eve-float-b" src={img('sticker-5')} alt="" aria-hidden="true" />
        <img className="eve-float eve-float-c" src={img('sticker-3')} alt="" aria-hidden="true" />
        <div className="eve-hero-inner">
          <p className="eve-kicker">INSTALLATION · ATTACHMENT OBJECT · 2025</p>
          <h1>在崩解前夕<em>On the Eve of Being Undone</em></h1>
          <p className="eve-lede">
            一件关于「阿贝贝」的讨论装置：把童年最柔软的那块布，和成年世界最锋利的那句话，放在同一个房间里。
          </p>
          <p className="eve-lede-en">
            A conversation piece about the attachment object — the comfort we are asked to grow out of.
          </p>
          <div className="eve-actions">
            <a className="eve-btn eve-btn-solid" href="#film">看作品影像 ↗</a>
            <a className="eve-btn" href="#object">看装置与物件</a>
          </div>
        </div>
        <img className="eve-hero-art" src={img('collage-hero')} alt="梦境拼贴：粉色的床、水母与鱼群" />
      </section>

      {/* ---------- 影片 ---------- */}
      <section className="eve-section eve-film-section" id="film">
        <div className="eve-film">
          <div className="eve-film-frame">
            <video
              ref={video}
              src={assetUrl('/videos/eve/film.mp4')}
              poster={assetUrl('/images/eve/film-poster.jpg')}
              playsInline
              preload="none"
              muted={muted}
              loop
              controls={playing}
            />
            {!playing && (
              <button type="button" className="eve-play" onClick={play} aria-label="播放作品影像">
                <span aria-hidden="true">▶</span>
                <small>2:12 · 有旁白</small>
              </button>
            )}
            <button
              type="button"
              className="eve-sound"
              onClick={() => { setMuted((m) => !m); const el = video.current; if (el) el.muted = !el.muted }}
              aria-label={muted ? '打开声音' : '静音'}
            >
              {muted ? '静音' : '有声'}
            </button>
          </div>
          <figcaption>《被丢弃的阿贝贝》· 影像与旁白</figcaption>
        </div>
      </section>

      {/* ---------- 独白 ---------- */}
      <section className="eve-section eve-voice">
        <header className="eve-head">
          <span className="eve-eyebrow">MONOLOGUE · 旁白节选</span>
          <h2>一个关于<em>消失</em>的故事</h2>
        </header>
        <ol className="eve-voice-list">
          {VOICE.map((line, i) => (
            <li key={line.zh} style={{ '--i': i } as React.CSSProperties}>
              <p className="eve-line">{line.zh}</p>
              <p className="eve-line-en">{line.en}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- 装置概念 ---------- */}
      <section className="eve-section eve-concept">
        <header className="eve-head">
          <span className="eve-eyebrow">DEVICE CONCEPT · 装置概念</span>
          <h2>数字焦虑<em>如何吃掉</em>有机的记忆</h2>
          <p>
            海洋般柔软的记忆——水母、星星——被数据云、错误代码和弹窗吞掉。
            所有自然的形态最终塌陷成一片损坏而矛盾的风景：二进制与柔光混在一起。
          </p>
        </header>
        <div className="eve-concept-grid">
          <figure>
            <img src={img('glitch')} alt="故障的脸" loading="lazy" />
            <figcaption>被数据块遮住的脸：柔软一旦被看见，就想先把自己打码</figcaption>
          </figure>
          <div className="eve-concept-notes">
            <div>
              <h3>柔软</h3>
              <p>棉花、白纱、粉色糖纸。它们本来只负责接住眼泪。</p>
            </div>
            <div>
              <h3>尖刺</h3>
              <p>当「依恋」被判定为幼稚，柔软必须长出刺，才配留在房间里。</p>
            </div>
            <div>
              <h3>崩解</h3>
              <p>二十四小时不断线的信息流，把记忆压缩成一张张缩略图。</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 装置现场 ---------- */}
      <section className="eve-section eve-install">
        <header className="eve-head">
          <span className="eve-eyebrow">INSTALLATION · 装置现场</span>
          <h2>把房间<em>泡进</em>蓝色里</h2>
          <p>投影、纱幔与实体小物共同构成一个「既像海底又像故障」的空间。</p>
        </header>
        <div className="eve-install-grid">
          {INSTALL.map((item) => (
            <figure key={item.file}>
              <img src={img(item.file)} alt={item.caption} loading="lazy" />
              <figcaption>{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------- 物件 ---------- */}
      <section className="eve-section eve-object" id="object">
        <header className="eve-head">
          <span className="eve-eyebrow">OBJECTS · 物件</span>
          <h2>那些<em>舍不得扔</em>的东西</h2>
        </header>

        <div className="eve-toggle" role="group" aria-label="柔软与尖刺">
          <button className={spiked ? 'is-on' : ''} onClick={() => setSpiked(true)}>尖刺的一面</button>
          <button className={!spiked ? 'is-on' : ''} onClick={() => setSpiked(false)}>柔软的一面</button>
        </div>

        <div className={`eve-object-stage ${spiked ? 'is-spiked' : ''}`}>
          <img className="eve-object-spike" src={img('spike')} alt="尖刺抱枕" loading="lazy" />
          <img className="eve-object-soft" src={img('bag')} alt="珠绣手提包" loading="lazy" />
          <p className="eve-object-caption">
            {spiked ? '同一块棉花：长刺的时候，它才被允许留在客厅。' : '收起来的时候，它只是一只装得下童年的包。'}
          </p>
        </div>

        <div className="eve-objects">
          {OBJECTS.filter((o) => o.file !== 'spike' && o.file !== 'bag').map((item) => (
            <figure key={item.file}>
              <img src={img(item.file)} alt={item.title} loading="lazy" />
              <figcaption>
                <strong>{item.title}</strong>
                <em>{item.en}</em>
                <p>{item.text}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------- 手稿 ---------- */}
      <section className="eve-section eve-journal">
        <header className="eve-head">
          <span className="eve-eyebrow">COLLAGE · 手稿与拼贴</span>
          <h2>先写在<em>本子上</em></h2>
          <p>项目从这些本子开始：涂鸦、糖纸、被划掉的句子，最后才变成装置。</p>
        </header>
        <div className="eve-journal-grid">
          {JOURNALS.map((item) => (
            <figure key={item.file}>
              <img src={img(item.file)} alt={item.caption} loading="lazy" />
              <figcaption>{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------- 小生物 ---------- */}
      <section className="eve-section eve-creatures">
        <header className="eve-head">
          <span className="eve-eyebrow">THE LITTLE ONES · 小生物</span>
          <h2>我们被要求<em>收起来</em>的那部分</h2>
        </header>
        <div className="eve-creatures-row">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <img key={i} src={img(`sticker-${i}`)} alt="" aria-hidden="true" loading="lazy" style={{ '--i': i } as React.CSSProperties} />
          ))}
        </div>
        <p className="eve-creatures-note">它们不会长大，也不会消失。它们只是被放进抽屉。</p>
      </section>

      {/* ---------- 研究 ---------- */}
      <section className="eve-section eve-research">
        <header className="eve-head">
          <span className="eve-eyebrow">RESEARCH · 研究</span>
          <h2>三个人<em>和一个</em>装置</h2>
        </header>
        <div className="eve-research-grid">
          <article>
            <h3>Jon Burgerman</h3>
            <p>
              把随手涂鸦变成一种对「成年人生活」的快乐反叛。他用糖果色和歪歪扭扭的线搭起避难所，
              这也直接决定了我的做法：把被判定为「幼稚」的安慰，画成一种视觉上的不服。
            </p>
          </article>
          <article>
            <h3>Evelyn Tan</h3>
            <p>
              她给了我一把钥匙：一种进入童年梦境的语言。我借来这种语言，却用它去讲一个更矛盾的现实——
              关于依恋、被审视与羞耻。柔软的梦，被我改写成带刺的宣言。
            </p>
          </article>
          <article>
            <h3>装置本身</h3>
            <p>
              拼贴把无辜的记忆与尖锐的批评并置：一边是糖纸和贴纸，一边是刺、错误代码与噪点。
              只有并置，才说得清「我需要」和「我羞耻」是同一种感情。
            </p>
          </article>
        </div>
      </section>

      <footer className="eve-end">
        <p className="eve-end-line">为所有被轻易丢弃的柔软。</p>
        <p className="eve-end-meta">On the Eve of Being Undone · 装置 / 影像 / 拼贴 · 2025</p>
        <Link className="eve-btn eve-btn-solid" to="/#worlds">回到六个世界 ↗</Link>
      </footer>
    </main>
  )
}
