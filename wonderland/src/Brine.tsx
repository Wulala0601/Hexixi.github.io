import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { assetUrl } from './assets'
import { links } from './content'
import ModelViewer from './ModelViewer'
import './brine.css'

const img = (name: string) => assetUrl(`/images/brine/${name}.webp`)

type Stock = 'on' | 'soon' | 'sold'

type Product = {
  id: string
  zh: string
  en: string
  price: number | null
  gift?: string
  giftShort?: string
  giftImg?: string
  stock: Stock
  note: string
  images: string[]
  tag: string
}

const PRODUCTS: Product[] = [
  {
    id: 'mint',
    zh: '薄荷波点古早少女包',
    en: 'Mint Polka Tote',
    price: 89,
    gift: '猫耳徽章',
    stock: 'on',
    tag: '最受欢迎',
    note: '薄荷绿波点帆布 + 蕾丝包边，正面是手绘少女印花。容量放得下 A5 本子、手机和一把小伞。',
    images: ['bag-mint-white', 'bag-mint-2', 'bag-mint-4'],
  },
  {
    id: 'ocean',
    zh: '旋转木马粉色海洋包',
    en: 'Carousel Ocean Tote',
    price: 72,
    gift: '亚克力 LOGO 钥匙扣',
    stock: 'on',
    tag: '全息',
    note: '粉蓝渐变的全息面料，光一转动颜色就变。包身轻，适合当日常小包。',
    images: ['bag-ocean', 'bag-ocean-2'],
  },
  {
    id: 'cat',
    zh: '天使黑猫包',
    en: 'Angel Black Cat Tote',
    price: 72,
    gift: '亚克力 LOGO 钥匙扣',
    stock: 'on',
    tag: '全息',
    note: '黑猫与星空的全息印花，暗处是黑，光下会浮出一整片银河。',
    images: ['bag-cat', 'bag-cat-2'],
  },
  {
    id: 'badge',
    zh: '梦核系列徽章 · 一套 6 个',
    en: 'Dreamcore Badge Set of 6',
    price: 69,
    gift: '随机手作胸花（吧唧托）1 枚',
    giftShort: '手作胸花',
    giftImg: 'gift-brooch',
    stock: 'on',
    tag: '一套 6 个',
    note: '蛋糕、格桑花、海豚、兔子、小马、钥匙和锁，六个一组，附背板。别在包上或帆布袋上都合适。',
    images: ['badge-set-white', 'badge-set-main', 'badge-set-grid'],
  },
]

const WORKS: { file: string; zh: string; en: string; hint: string; gift?: string; giftImg?: string }[] = [
  { file: 'work-duck', zh: '小黄鸭系列', en: 'Rubber Duck', hint: '印花打样完成' },
  { file: 'work-love', zh: '少女的爱系列', en: 'Girl in Love', hint: '配色调整中', gift: '指虎徽章', giftImg: 'work-badge-3' },
  { file: 'work-bear', zh: '复古小熊系列', en: 'Retro Bear', hint: '黑蕾丝 + 小熊' },
  { file: 'work-piano', zh: '钢琴系列', en: 'Piano', hint: '琴键与花' },
  { file: 'work-badge-2', zh: '徽章 · 系列二', en: 'Badge Series II', hint: '九个一组' },
]

const GIFTS = [
  { name: '猫耳徽章', rule: '买薄荷波点包赠' },
  { name: '亚克力 LOGO 钥匙扣', rule: '买黑猫包 / 海洋包赠' },
  { name: '随机手作胸花（吧唧托）', rule: '拍梦核徽章整套赠，款式随机' },
  { name: 'LOGO 贴纸', rule: '随单附赠' },
]

const REVIEWS: { file: string; name: string; text: string; date?: string }[] = [
  { file: 'review-01', name: '捏捏BB', text: '太可爱了……包装超可爱', date: '09-02' },
  { file: 'review-02', name: 'rahlitrap', text: '好可爱，还有珠光闪闪的好漂亮', date: '05-23' },
  { file: 'review-03', name: 'mino', text: '包包真的超级好看，店主更是温柔又可爱', date: '07-21' },
  { file: 'review-04', name: 'rahlitrap', text: '好可爱的包包！里面还有拉链和内袋，好用心', date: '04-22' },
  { file: 'review-05', name: '捏捏BB', text: '就这样萌死我吧', date: '09-02' },
  { file: 'review-06', name: 'babybel', text: '分享萌萌包，店主还送了可爱阿拉蕾小夹子', date: '09-05' },
  { file: 'review-07', name: 'yy', text: '容量很大，面料还防水，日常搭衣服也很可爱', date: '09-07' },
  { file: 'review-08', name: 'yy', text: '已经在你家买过两个包包了', date: '09-07' },
  { file: 'review-09', name: '烤菠萝', text: '特别可爱的设计，容量也很大，特别喜欢薄荷绿', date: '09-06' },
  { file: 'review-10', name: '买家晒单', text: '薄荷绿配全套徽章，出门一次带齐' },
  { file: 'review-11', name: '买家晒单', text: '粉蓝海洋包配格裙，意外地搭' },
]

const stockLabel: Record<Stock, string> = { on: '在售', soon: '即将上架', sold: '补货中' }

export default function Brine() {
  const [open, setOpen] = useState<Product | null>(null)
  const dialog = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = 'BRINE · 小小商店 — HE XIXI'
    const id = new URLSearchParams(window.location.search).get('p')
    if (id) {
      const hit = PRODUCTS.find((p) => p.id === id)
      if (hit) setOpen(hit)
    }
    return () => { document.title = 'HE XIXI — Soft Error Wonderland' }
  }, [])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null) }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <main className="brine">
      <div className="brine-wash" aria-hidden="true" />

      {/* ---------- 封面 ---------- */}
      <section className="brine-hero">
        <div className="brine-hero-text">
          <img className="brine-mark" src={img('logo-mark')} alt="BRINE 标志" />
          <p className="brine-kicker">BRINE · SMALL THINGS, MADE SLOWLY</p>
          <h1>把古早的<em>少女心</em>，装进口袋</h1>
          <p className="brine-lede">
            BRINE 是我自己的小品牌：帆布包、徽章、钥匙扣和贴纸。
            每一样都是先画、再打版、最后自己打包寄出去的东西。
          </p>
          <p className="brine-slogan">
            BRINE 就是一些像夏天一样的小东西。<br />
            如果你偶尔想从现实里躲一躲，它们可以陪着你。
          </p>
          <div className="brine-actions">
            <a className="brine-btn brine-btn-solid" href="#shop">看在售 ↗</a>
            <a className="brine-btn" href="#works">看作品</a>
            <a className="brine-btn" href="#model">模型项目</a>
          </div>
        </div>
        <figure className="brine-hero-art">
          <img src={img('logo-lace')} alt="BRINE 蕾丝版标志" />
          <figcaption>薄荷蕾丝 · 限定标</figcaption>
        </figure>
      </section>

      {/* ---------- 在售 ---------- */}
      <section className="brine-section" id="shop">
        <header className="brine-head">
          <span className="brine-eyebrow">01 · ON SALE</span>
          <h2>现在能买到的<em>四样</em></h2>
          <p>点开看细节，链接会跳到小红书或淘宝。买包都有赠品。</p>
        </header>

        <div className="brine-grid">
          {PRODUCTS.map((product) => (
            <article
              key={product.id}
              className="brine-card"
              role="button"
              tabIndex={0}
              aria-label={`查看 ${product.zh}`}
              onClick={() => setOpen(product)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(product) }
              }}
            >
              <div className="brine-card-art">
                <img src={img(product.images[0])} alt={product.zh} loading="lazy" />
                {product.gift && <span className="brine-ribbon">赠 · {product.giftShort ?? product.gift}</span>}
                <span className={`brine-stock is-${product.stock}`}>{stockLabel[product.stock]}</span>
              </div>
              <div className="brine-card-body">
                <span className="brine-tag">{product.tag}</span>
                <h3>{product.zh}<em>{product.en}</em></h3>
                <p className="brine-price">{product.price ? `¥${product.price}` : '待定'}</p>
                <span className="brine-more">看细节 →</span>
              </div>
            </article>
          ))}
        </div>

        {/* 赠品 */}
        <div className="brine-gifts">
          <span className="brine-eyebrow">GIFT WITH PURCHASE</span>
          <ul>
            {GIFTS.map((gift) => (
              <li key={gift.name}>
                <img src={img('logo-mark')} alt="" aria-hidden="true" />
                <strong>{gift.name}</strong>
                <span>{gift.rule}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* 制作流程 */}
        <div className="brine-process">
          <span className="brine-eyebrow">HOW IT'S MADE</span>
          <ol>
            {['印花打样', '车缝', '改色', '拍图', '写文案', '打包'].map((step, i) => (
              <li key={step}>
                <span className="brine-step-no">{String(i + 1).padStart(2, '0')}</span>
                {step}
              </li>
            ))}
          </ol>
          <p>
            一只包从画稿到寄出，要经过这六步。中间有两次整批做错，只能自己留着用。
          </p>
        </div>
      </section>
      <section className="brine-section" id="reviews">
        <header className="brine-head">
          <span className="brine-eyebrow">02 · REAL REVIEWS</span>
          <h2>买过的人<em>怎么说</em></h2>
          <p>下面都是小红书买家自己拍的照片，文字是他们写的，我只做了排版。</p>
        </header>
        <div className="brine-reviews">
          {REVIEWS.map((review) => (
            <figure key={review.file} className="brine-review">
              <img src={img(review.file)} alt={`${review.name} 的买家秀`} loading="lazy" />
              <figcaption>
                <strong>{review.name}</strong>
                <p>{review.text}</p>
                <span>{review.date ? review.date + ' · 小红书' : '小红书晒单'}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------- 作品 ---------- */}
      <section className="brine-section" id="works">
        <header className="brine-head">
          <span className="brine-eyebrow">03 · IN THE WORKS</span>
          <h2>还在<em>打版</em>的系列</h2>
          <p>这些还没上架，先放在这里。做好一个放一个。</p>
        </header>
        <div className="brine-works">
          {WORKS.map((work) => (
            <figure key={work.file}>
              <img src={img(work.file)} alt={work.zh} loading="lazy" />
              <figcaption>
                <strong>{work.zh}</strong>
                <em>{work.en}</em>
                <span>{work.hint} · 未上架</span>
                {work.gift && <span className="brine-works-gift">附赠 · {work.gift}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------- 模型 ---------- */}
      <section className="brine-section brine-model" id="model">
        <header className="brine-head">
          <span className="brine-eyebrow">04 · 3D MODEL</span>
          <h2>薄荷猫耳少女，<em>做成了钥匙扣</em></h2>
          <p>
            最早是首页里那个 3D 模型。现在打成白膜：15cm 高、3D 打印，头顶加了一个圆环，可以挂在包上。
            左边这个可以拖动旋转。
          </p>
        </header>

        <div className="brine-model-grid">
          <div className="brine-model-stage">
            <ModelViewer />
          </div>
          <div className="brine-model-shots">
            {['model-01', 'model-02', 'model-03', 'model-04'].map((name, i) => (
              <img key={name} src={img(name)} alt={`薄荷猫耳少女白膜 ${i + 1}`} loading="lazy" />
            ))}
            <figure className="brine-model-ring">
              <img src={img('model-ring')} alt="头顶的圆环细节" loading="lazy" />
              <figcaption>头顶的圆环 · 后加的</figcaption>
            </figure>
          </div>
        </div>

        <div className="brine-model-facts">
          <ul>
            <li><span>高度</span><strong>15 cm</strong></li>
            <li><span>工艺</span><strong>3D 打印 · 白膜</strong></li>
            <li><span>挂环</span><strong>可挂包 / 钥匙</strong></li>
            <li><span>状态</span><strong>准备出售</strong></li>
          </ul>
          <div className="brine-model-actions">
            <Link className="brine-btn brine-btn-solid" to="/ip-models">看原始模型 ↗</Link>
            <span className="brine-soon">实体上架筹备中</span>
          </div>
        </div>
      </section>
      {/* ---------- 页脚 ---------- */}
      <footer className="brine-end">
        <img className="brine-end-mark" src={img('wordmark')} alt="BRINE 字标" loading="lazy" />
        <p className="brine-end-line">Small things, made slowly.</p>
        <div className="brine-end-links">
          <a className="brine-btn brine-btn-solid" href={links.redShop} target="_blank" rel="noopener noreferrer">小红书店铺 ↗</a>
          <a className="brine-btn" href={links.taobao} target="_blank" rel="noopener noreferrer">淘宝店铺 ↗</a>
          <Link className="brine-btn" to="/#worlds">回到六个世界 ↗</Link>
        </div>
      </footer>

      {/* ---------- 详情弹层 ---------- */}
      {open && (
        <div className="brine-modal" onClick={() => setOpen(null)}>
          <div
            className="brine-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={open.zh}
            tabIndex={-1}
            ref={dialog}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="brine-close" onClick={() => setOpen(null)} aria-label="关闭">×</button>
            <div className="brine-dialog-art">
              {open.images.map((name, i) => (
                <img key={name} src={img(name)} alt={`${open.zh} 图 ${i + 1}`} loading={i ? 'lazy' : 'eager'} />
              ))}
            </div>
            <div className="brine-dialog-body">
              <span className={`brine-stock is-${open.stock}`}>{stockLabel[open.stock]}</span>
              <h3>{open.zh}<em>{open.en}</em></h3>
              <p className="brine-price">{open.price ? `¥${open.price}` : '价格待定'}</p>
              <p className="brine-dialog-note">{open.note}</p>
              {open.gift && (
                <p className="brine-dialog-gift">
                  <img src={img(open.giftImg ?? 'logo-mark')} alt="" aria-hidden="true" />
                  随包附赠：<strong>{open.gift}</strong>
                </p>
              )}
              <div className="brine-dialog-links">
                <a className="brine-btn brine-btn-solid" href={links.redShop} target="_blank" rel="noopener noreferrer">去小红书买 ↗</a>
                <a className="brine-btn" href={links.taobao} target="_blank" rel="noopener noreferrer">去淘宝买 ↗</a>
              </div>
              <p className="brine-dialog-hint">链接暂为店铺首页，单品链接待补。</p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
