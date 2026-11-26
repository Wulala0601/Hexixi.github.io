import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { assetUrl } from './assets'
import './anicat.css'

const img = (name: string) => assetUrl(`/images/anicat/${name}.webp`)

const FLAVOURS = [
  { id: 'chicken-breast', zh: '鸡胸肉', en: 'Chicken Breast', tag: '100% Natural', colour: '#f7941e' },
  { id: 'chicken', zh: '鸡肉', en: 'Chicken', tag: '100% Natural', colour: '#1d6fb8' },
  { id: 'egg-yolk', zh: '蛋黄', en: 'Egg Yolk', tag: '100% Natural', colour: '#f9b233' },
  { id: '3mixes', zh: '三拼', en: '3 Mixes', tag: '100% Natural', colour: '#8f6bc4' },
  { id: '4mixes', zh: '四拼', en: '4 Mixes', tag: '100% Natural', colour: '#1f3f7a' },
]

const ILLUS = [
  { file: 'illus-1', zh: '客厅', en: 'Living room' },
  { file: 'illus-2', zh: '厨房', en: 'Kitchen' },
  { file: 'illus-3', zh: '卧室', en: 'Bedroom' },
  { file: 'illus-4', zh: '万圣节', en: 'Halloween' },
  { file: 'illus-5', zh: '露营', en: 'Camping' },
  { file: 'illus-6', zh: '游乐园', en: 'Carousel' },
]

const TABS = [
  { id: 'story', label: '品牌故事' },
  { id: 'ip', label: 'IP 角色' },
  { id: 'pack', label: '包装' },
  { id: 'visual', label: '视觉与 UGC' },
]

export default function Anicat() {
  const [flavour, setFlavour] = useState(FLAVOURS[0])

  useEffect(() => {
    document.title = 'ANICAT — 泰国宠物食品品牌视觉 — HE XIXI'
    return () => { document.title = 'HE XIXI — Soft Error Wonderland' }
  }, [])

  return (
    <main className="ani">
      {/* ---------- 首屏 ---------- */}
      <section className="ani-hero">
        <div className="ani-hero-text">
          <p className="ani-kicker">BRAND IDENTITY · THAILAND · 2025</p>
          <h1>ANICAT<em lang="th">อาหารแมวธรรมชาติ 100%</em></h1>
          <p className="ani-lede">
            泰国宠物食品品牌的整套视觉：名字、标志、角色、包装与店铺。
            一只三花猫和一只橘猫，把「天然」讲成了可爱的事。
          </p>
          <p className="ani-slogan">Love for ANIMAL, Life with CAT.</p>
          <div className="ani-tags">
            <span>品牌策略</span><span>标志</span><span>IP 角色</span><span>包装</span><span>店铺视觉</span>
          </div>
          <a className="ani-btn ani-btn-solid" href="#story">看完整提案 ↗</a>
        </div>
        <figure className="ani-hero-art">
          <img src={img('hero')} alt="ANICAT 泰国主视觉：100% 天然冻干猫零食，最高五折" />
          <figcaption lang="th">แห้งแซ่แข็งธรรมชาติ 100% · ลดสูงสุด 50%</figcaption>
        </figure>
      </section>

      {/* ---------- 快览 ---------- */}
      <nav className="ani-tabs" aria-label="页面导航">
        {TABS.map((tab) => (
          <a key={tab.id} href={`#${tab.id}`}>{tab.label}</a>
        ))}
      </nav>

      {/* ---------- 品牌故事 ---------- */}
      <section className="ani-section" id="story">
        <header className="ani-head">
          <span className="ani-eyebrow">01 · BRAND STRATEGY</span>
          <h2>先讲清楚<em>为什么是 ANICAT</em></h2>
          <p>名字由 ANI(mal) 与 CA(t) 拼成。品牌要同时装下两件事：对动物的爱，和一个能被抱在怀里的形象。</p>
        </header>

        <div className="ani-cards">
          <article>
            <span className="ani-num">01</span>
            <h3>市场机会</h3>
            <p>泰国的猫经济正在长，但「天然、冻干、可信任」的日常零食仍集中在少数进口品牌，价格高、包装冷。</p>
          </article>
          <article>
            <span className="ani-num">02</span>
            <h3>名字的来历</h3>
            <p>ANICA 读起来像一个人的名字。加一个 T 就是 ANICAT——把猫直接写进品牌里，不用解释。</p>
          </article>
          <article>
            <span className="ani-num">03</span>
            <h3>设计挑战</h3>
            <p>「100% 天然」通常长得像药盒。要在健康感与亲和力之间找到中间值：专业，但先让人想摸一下。</p>
          </article>
        </div>

        <figure className="ani-wide">
          <img src={img('slide-story')} alt="品牌策略与叙事：市场机会、名字来历、设计挑战" loading="lazy" />
          <figcaption>Brand Strategy and Narrative — 三块内容的原始排版</figcaption>
        </figure>
      </section>

      {/* ---------- Logo ---------- */}
      <section className="ani-section ani-logo">
        <header className="ani-head">
          <span className="ani-eyebrow">02 · LOGO</span>
          <h2>标志与<em>字标</em></h2>
        </header>
        <div className="ani-logo-grid">
          <figure className="ani-logo-main">
            <img src={img('logo')} alt="AniCat 立体字标" loading="lazy" />
            <figcaption>主字标：圆头笔画的猫耳，橙色落在 t 的收笔上</figcaption>
          </figure>
          <figure>
            <img src={img('slide-logo')} alt="标志设计：ANICA 与 ANICAT 组合" loading="lazy" />
            <figcaption>ANICA / ANICAT 的六种组合，对应包装与门店场景</figcaption>
          </figure>
        </div>
        <p className="ani-note">品牌口号 <strong>Love Without Burden</strong>，性格关键词：Youthful · Energetic · Caring。</p>
      </section>

      {/* ---------- IP ---------- */}
      <section className="ani-section" id="ip">
        <header className="ani-head">
          <span className="ani-eyebrow">03 · IP DESIGN</span>
          <h2>一只三花猫，<em>和一只橘猫</em></h2>
          <p>KAKA 负责吃，ANI 负责闹。两个角色撑起了所有插画、贴纸和包装背面。</p>
        </header>

        <div className="ani-ip">
          <figure className="ani-ip-card">
            <img src={img('mascot-a')} alt="ANI 三花猫三维形象" loading="lazy" />
            <figcaption><strong>ANI</strong>三花猫 · 运动员 / 芭蕾舞者，满格活力</figcaption>
          </figure>
          <figure className="ani-ip-card">
            <img src={img('mascot-b')} alt="KAKA 橘猫三维形象" loading="lazy" />
            <figcaption><strong>KAKA</strong>橘猫 · 吃货 / 摄影师 / 户外爱好者</figcaption>
          </figure>
          <figure className="ani-wide ani-ip-slide">
            <img src={img('slide-ip')} alt="IP 设计说明：KAKA 与 ANI 的设定" loading="lazy" />
            <figcaption>KAKA &amp; ANI: The Perfect Duo</figcaption>
          </figure>
        </div>

        <div className="ani-illus">
          {ILLUS.map((item) => (
            <figure key={item.file}>
              <img src={img(item.file)} alt={`${item.zh}场景插画`} loading="lazy" />
              <figcaption>{item.zh}<em>{item.en}</em></figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------- 包装 ---------- */}
      <section className="ani-section" id="pack">
        <header className="ani-head">
          <span className="ani-eyebrow">04 · PACKAGING</span>
          <h2>五种口味，<em>一套语言</em></h2>
          <p>每款一个主色，正面只留三件事：100% NATURAL、猫、口味。背面放成分与喂食表。</p>
        </header>

        <div className="ani-pack">
          <div className="ani-pack-stage" style={{ '--tint': flavour.colour } as React.CSSProperties}>
            <img key={flavour.id} src={img(`pouch-${flavour.id}`)} alt={`${flavour.zh}包装正面与背面`} />
          </div>
          <div className="ani-pack-side">
            <div className="ani-chips" role="group" aria-label="选择口味">
              {FLAVOURS.map((item) => (
                <button
                  key={item.id}
                  className={item.id === flavour.id ? 'is-on' : ''}
                  style={{ '--chip': item.colour } as React.CSSProperties}
                  onClick={() => setFlavour(item)}
                >
                  {item.zh}<em>{item.en}</em>
                </button>
              ))}
            </div>
            <p className="ani-pack-note">
              当前口味：<strong>{flavour.zh} {flavour.en}</strong> · Freeze-Dried · 100% Natural
            </p>
            <div className="ani-tubs">
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <img key={n} src={img(`tub-${n}`)} alt="" aria-hidden="true" loading="lazy" />
              ))}
            </div>
          </div>
        </div>

        <figure className="ani-wide">
          <img src={img('slide-packaging')} alt="包装设计：100% 纯，满分活力" loading="lazy" />
          <figcaption>Packaging Design — “100% Pure, Full-Score Vitality”</figcaption>
        </figure>
      </section>

      {/* ---------- 视觉与 UGC ---------- */}
      <section className="ani-section" id="visual">
        <header className="ani-head">
          <span className="ani-eyebrow">05 · VISUAL &amp; UGC</span>
          <h2>贴纸，是<em>最好的广告位</em></h2>
          <p>两版贴纸（蓝 / 粉）跟着订单走。买家把贴纸贴在手机、水壶、冰箱上，品牌就长在了生活里。</p>
        </header>

        <div className="ani-stickers">
          <figure><img src={img('sticker-blue')} alt="蓝色贴纸版" loading="lazy" /><figcaption>贴纸 A · 蓝</figcaption></figure>
          <figure><img src={img('sticker-pink')} alt="粉色贴纸版" loading="lazy" /><figcaption>贴纸 B · 粉</figcaption></figure>
          <figure><img src={img('photo-2')} alt="买家手持贴纸拍照" loading="lazy" /><figcaption>晒单 · 手持贴纸</figcaption></figure>
          <figure><img src={img('photo-1')} alt="买家与产品合影" loading="lazy" /><figcaption>晒单 · 开袋</figcaption></figure>
          <figure><img src={img('photo-3')} alt="猫与产品合影" loading="lazy" /><figcaption>晒单 · 猫与产品</figcaption></figure>
          <figure><img src={img('chat')} alt="社媒对话样式" loading="lazy" /><figcaption>社媒对话模板</figcaption></figure>
        </div>

        <div className="ani-pairs">
          <figure className="ani-wide">
            <img src={img('slide-identity')} alt="品牌视觉识别：主题插画" loading="lazy" />
            <figcaption>Brand Visual Identity — 主题插画驱动的互动</figcaption>
          </figure>
          <figure className="ani-wide">
            <img src={img('slide-ugc')} alt="贴纸、买家秀与社区行为" loading="lazy" />
            <figcaption>Stickers Spark UGC — 贴纸如何带动二次传播</figcaption>
          </figure>
        </div>
      </section>

      {/* ---------- 店铺 ---------- */}
      <section className="ani-section ani-shop">
        <header className="ani-head">
          <span className="ani-eyebrow">06 · DIGITAL STOREFRONT</span>
          <h2>把货架<em>也做成品牌</em></h2>
        </header>
        <div className="ani-shop-grid">
          <figure><img src={img('shop-1')} alt="店铺首页排版 A" loading="lazy" /><figcaption>店铺首页 · 版式 A</figcaption></figure>
          <figure><img src={img('shop-2')} alt="店铺首页排版 B" loading="lazy" /><figcaption>店铺首页 · 版式 B</figcaption></figure>
          <figure><img src={img('slide-shop-a')} alt="店铺视觉提案 A" loading="lazy" /><figcaption>Crafting the Digital Storefront · A</figcaption></figure>
          <figure><img src={img('slide-shop-b')} alt="店铺视觉提案 B" loading="lazy" /><figcaption>Crafting the Digital Storefront · B</figcaption></figure>
        </div>
      </section>

      <footer className="ani-end">
        <p className="ani-end-th" lang="th">ขอบคุณค่ะ</p>
        <p className="ani-end-line">ANICAT · Pure Pet Life · Brand Identity Design</p>
        <p className="ani-end-meta">Love for ANIMAL, Life with CAT. That&apos;s ANICA.</p>
        <Link className="ani-btn ani-btn-solid" to="/#worlds">回到六个世界 ↗</Link>
      </footer>
    </main>
  )
}
