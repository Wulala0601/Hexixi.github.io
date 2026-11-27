import { useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { assetUrl } from './assets'
import './identity.css'

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
  { k: '出身', v: '北理珠 · 服装与服饰设计' },
  { k: '做过', v: '3 个品牌从 0 到 1' },
  { k: '数字', v: '单月 15000+ 件（2024.12 潮牌）' },
]

const MARQUEE = [
  '油画', '国画', '素描', '版画', '插画', 'PS', 'SAI', 'Midjourney',
  '品牌视觉', '包装', 'IP 角色', '空间叙事', '3D 打印',
]

export default function Identity() {
  const [open, setOpen] = useState(false)

  return (
    <section className="chapter idv" id="identity" data-chapter="1">
      <div className="idv-inner">
        <div className="idv-main">
          <span className="idv-eyebrow">01 / 柔软的自我介绍</span>
          <h2 className="idv-title">
            很多<span className="idv-hi">小小的</span>东西。
            <br />
            一个<em>好奇</em>的脑袋。
          </h2>
          <p className="idv-lede">
            我是何茜茜（HE XIXI），一名跨领域设计师与 IP 创作者。
            把情绪、日常物件和细小的古怪，做成角色、品牌，和可以走进去的空间。
          </p>

          <dl className="idv-facts">
            {FACTS.map((fact) => (
              <div key={fact.k}>
                <dt>{fact.k}</dt>
                <dd>{fact.v}</dd>
              </div>
            ))}
          </dl>

          <div className="idv-actions">
            <Link className="idv-btn" to="/about">多了解我一点 ↗</Link>
            <a className="idv-link" href={assetUrl('/docs/xixi-resume.pdf')} target="_blank" rel="noopener noreferrer">
              下载简历 PDF ↗
            </a>
          </div>
        </div>

        <aside className="idv-side">
          <p className="idv-side-label">{open ? '再点一下收起来' : '六个标签 · 悬停或点击散开'}</p>
          <div
            className={`idv-tags ${open ? 'is-open' : ''}`}
            tabIndex={0}
            role="button"
            aria-expanded={open}
            aria-label="我的标签，点击散开"
            onClick={() => setOpen((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen((v) => !v) }
            }}
          >
            {TAGS.map((tag, i) => (
              <img
                key={tag.file}
                src={img(tag.file)}
                alt={tag.label}
                style={{ '--i': i } as CSSProperties}
                loading="lazy"
              />
            ))}
          </div>
        </aside>
      </div>

      <div className="idv-marquee" aria-hidden="true">
        <div className="idv-marquee-track">
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
  )
}
