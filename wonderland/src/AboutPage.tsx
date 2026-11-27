import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { assetUrl } from './assets'
import { imageUrl, links } from './content'
import './about-page.css'

const img = (name: string) => assetUrl(`/images/${name}.webp`)

const TAGS = [
  { file: 'tag-1', label: 'ANIME' },
  { file: 'tag-2', label: 'TATTOO' },
  { file: 'tag-3', label: 'ISFP' },
  { file: 'tag-4', label: 'GEMINI' },
  { file: 'tag-5', label: 'IP CREATOR' },
  { file: 'tag-6', label: 'DREAMCORE' },
]

const FACTS = [
  { k: '现在', v: '深圳 · 平面设计 / 产品开发' },
  { k: '出身', v: '北京理工大学珠海学院 · 服装与服饰设计' },
  { k: '做过', v: '3 个品牌从 0 到 1（潮牌 / 宠物 / 3C）' },
  { k: '数字', v: '单月 15000+ 件（2024.12 潮牌爆款）' },
  { k: '顺手', v: 'PS · SAI · Midjourney' },
  { k: '语言', v: '中文 / 英文（雅思 5.5）' },
]

const MAKES = [
  '视觉识别与品牌系统',
  '原创角色与 IP 世界',
  '包装、周边与物料',
  '数字艺术、动态与 3D 场景',
  '物件与空间叙事',
]

const MARQUEE = ['油画', '国画', '素描', '版画', '插画', 'PS', 'SAI', 'Midjourney', '品牌视觉', '包装', 'IP 角色', '3D 打印']

export default function AboutPage() {
  return (
    <main className="ap">
      <section className="ap-hero">
        <div className="ap-copy">
          <p className="ap-eyebrow">ABOUT / HE XIXI</p>
          <h1 className="ap-title">
            给尖锐想法
            <br />
            留一处<span className="ap-hi">柔软</span>空间。
          </h1>
          <p className="ap-lede">
            我是 HE XIXI / 何茜茜，一名跨领域设计师与原创 IP 创作者。
            我的创作往返于平面设计、品牌系统、数字艺术与空间叙事之间。
          </p>
          <p className="ap-sub">
            做过潮牌、宠物食品和 3C 跨境：从 0 搭品牌、画 IP、做包装，
            也跟着打版和发货。喜欢把情绪和日常的小古怪，做成能被带走的东西。
          </p>

          <dl className="ap-facts">
            {FACTS.map((fact) => (
              <div key={fact.k}>
                <dt>{fact.k}</dt>
                <dd>{fact.v}</dd>
              </div>
            ))}
          </dl>

          <div className="ap-actions">
            <a className="ap-btn" href={assetUrl('/docs/xixi-resume.pdf')} target="_blank" rel="noopener noreferrer">
              下载简历 PDF ↗
            </a>
            <a className="ap-link" href={links.email}>xixihe@ln.hk ↗</a>
            <Link className="ap-link" to="/#worlds">回到六个世界 ↗</Link>
          </div>
        </div>

        <figure className="ap-portrait">
          <img src={imageUrl('portrait')} alt="何茜茜的肖像" />
          <figcaption>HE XIXI · 深圳</figcaption>
        </figure>
      </section>

      <section className="ap-tags-section">
        <header className="ap-section-head">
          <span className="ap-eyebrow">TAGS / 关于我的六个标签</span>
          <h2>把它们<em>拉开</em>看</h2>
          <p>六个吊牌挂在一起，鼠标放上去会散得更开一点。</p>
        </header>

        <div className="ap-tags" tabIndex={0} aria-label="我的六个标签">
          {TAGS.map((tag, i) => (
            <img key={tag.file} src={img(tag.file)} alt={tag.label} style={{ '--i': i } as CSSProperties} loading="lazy" />
          ))}
        </div>
      </section>

      <section className="ap-make">
        <header className="ap-section-head">
          <span className="ap-eyebrow">WHAT I MAKE / 我做什么</span>
          <h2>五个方向，<em>一条线</em></h2>
        </header>
        <ol className="ap-make-list">
          {MAKES.map((item, i) => (
            <li key={item}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              {item}
            </li>
          ))}
        </ol>

        <div className="ap-marquee" aria-hidden="true">
          <div className="ap-marquee-track">
            {[0, 1].map((copy) => (
              <span key={copy}>
                {MARQUEE.map((word) => (
                  <b key={word + copy}>{word}</b>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
