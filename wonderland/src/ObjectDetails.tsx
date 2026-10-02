import { assetUrl } from './assets'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { links } from './content'
import { usePreferences } from './preferences'
import photos from './bag-images.json'

export function BagDetails() {
  const { t } = usePreferences()
  const drag = useRef<number | null>(null)
  const [back, setBack] = useState(false)
  return <main id="main" className="inner-page object-detail bag-detail">
    <Link className="text-link object-back" to="/#little-shop">← {t('Back to little objects', '返回小小的物件')}</Link>
    <div className="bag-product-intro"><span className="eyebrow">ITEM · 01 / BRINE</span><h1>{t('Mint catgirl · printed Tyvek bag', 'BRINE 喵系古早卡通印花杜邦纸包')}</h1></div>
    <div className="bag-spinner" onPointerDown={e => { drag.current = e.clientX; e.currentTarget.setPointerCapture(e.pointerId) }} onPointerMove={e => { if (drag.current !== null && Math.abs(e.clientX - drag.current) > 50) { setBack(v => !v); drag.current = e.clientX } }} onPointerUp={() => { drag.current = null }} onPointerCancel={() => { drag.current = null }}>
      <img className="bag-doily" src={assetUrl('/images/bag/lace-doily.webp')} alt="" loading="lazy" draggable={false}/>
      <img className="bag-angle" src={assetUrl(`/images/bag/${back ? 'back' : 'front'}.webp`)} alt={back ? t('Back of the mint bag', '薄荷波点包背面') : t('Front of the mint bag', '薄荷波点包正面')} loading="lazy" draggable={false}/>
    </div>
    <div className="bag-view-controls"><button onClick={() => setBack(v => !v)} aria-label={t('Previous bag view', '切换包包视图')}>←</button><span>{t('Drag to see both sides', '左右拖动 · 查看正反面')} · {back ? '02' : '01'} / 02</span><button onClick={() => setBack(v => !v)} aria-label={t('Next bag view', '下一张包包视图')}>→</button></div>
    <div className="bag-detail-gallery" aria-label={t('Bag product photographs', '包包商品详情图片')}>{photos.map((photo, i) => <img key={photo.src} src={assetUrl(photo.src)} width={photo.width} height={photo.height} alt={t(`Mint polka-dot bag · product photograph ${i + 1}`, `古早薄荷绿波点包 · 商品实拍 ${i + 1}`)} loading="lazy"/>)}</div>
    <div className="bag-marks"><img src={assetUrl('/images/bag/wordmark.webp')} alt="BRINE" loading="lazy"/><img src={assetUrl('/images/bag/emblem.webp')} alt="" loading="lazy"/></div>
    <div className="bag-shop-links"><a className="pill" href={links.redShop} target="_blank" rel="noopener noreferrer">{t('Visit the Xiaohongshu shop', '前往小红书店铺')} ↗</a><Link className="text-link" to="/model-details">{t('Meet the original IP figures', '看看原创 IP 模型')} ↗</Link></div>
  </main>
}

export function ModelDetails() {
  const { t } = usePreferences()
  return <main id="main" className="inner-page object-detail model-detail">
    <Link className="text-link object-back" to="/#little-shop">← {t('Back to little objects', '返回小小的物件')}</Link>
    <header className="object-detail-heading"><span className="eyebrow">ITEM · 02 / ORIGINAL IP</span><h1>{t('A little character, coming to life.', '把小小的角色，带进生活。')}</h1></header>
    <div className="model-preview-layout">
      <img src={assetUrl('/images/model-preview.png')} alt={t('Original catgirl figure with a heart key and strap', '带爱心钥匙与挂绳的原创猫耳少女模型')} width="2324" height="3098"/>
      <section className="model-coming-soon" aria-labelledby="model-status"><span className="eyebrow">COMING SOON</span><h2 id="model-status">{t('More little details to come.', '模型详情，正在准备中。')}</h2><p>{t('For now, meet her here. More photographs and the story behind this character will be added later.', '先在这里和她见一面。更多图片与角色介绍，之后会慢慢补上。')}</p><Link className="pill" to="/#little-shop">{t('Back to little objects', '返回小小的物件')} ↗</Link></section>
    </div>
  </main>
}
