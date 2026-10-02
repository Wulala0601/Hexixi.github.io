import { assetUrl } from './assets'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePreferences } from './preferences'

export default function BagShowcase() {
  const { t, reduced } = usePreferences()
  const video = useRef<HTMLVideoElement>(null)
  const manuallyPaused = useRef(false)
  const [playing, setPlaying] = useState(false)
  const [videoError, setVideoError] = useState(false)
  useEffect(() => {
    const media = video.current
    if (!media) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reduced && !manuallyPaused.current && !document.hidden) void media.play().catch(() => {})
      else media.pause()
    }, { threshold: .35 })
    observer.observe(media)
    const hide = () => { if (document.hidden) media.pause() }
    document.addEventListener('visibilitychange', hide)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', hide); media.pause() }
  }, [reduced])
  const toggle = () => {
    const media = video.current
    if (!media) return
    if (media.paused) { manuallyPaused.current = false; void media.play().catch(() => setVideoError(true)) }
    else { manuallyPaused.current = true; media.pause() }
  }
  return <section className="chapter shop-chapter bag-showcase" id="little-shop" data-chapter="3" aria-labelledby="bag-showcase-title">
    <header className="bag-intro"><span className="eyebrow">03 / {t('FROM MY WORLD, TO YOURS', '从我的世界，到你的生活')}</span><h2 id="bag-showcase-title">{t('Little things.', '小小的物件。')}<br/><em>{t('Big personalities.', '大大的性格。')}</em></h2><p>{t('A little mint, a little nostalgia. An original bag to carry your everyday world.', '一点薄荷，一点古早的可爱。把原创角色和小小的日常一起装进包里。')}</p></header>
    <div className="object-video">
      <div className="pink-computer">
        <img className="pink-computer-shell" src={assetUrl('/images/pink-computer.png')} width="1200" height="1200" alt={t('A pink iBook playing the bag film', '正在放映包包视频的粉色 iBook 电脑')} loading="lazy"/>
        <div className="pink-computer-screen"><video ref={video} src={assetUrl('/media/mint-bag.mp4')} poster={assetUrl('/images/bag/01.webp')} muted loop playsInline preload="none" controls onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setVideoError(true)} aria-label={t('Mint bag product video', '薄荷波点包展示视频')}/></div>
      </div>
      <button className="object-video-toggle" onClick={toggle} aria-label={playing ? t('Pause bag video', '暂停包包视频') : t('Play bag video', '播放包包视频')}>{playing ? 'Ⅱ' : '▶'} {playing ? t('Pause', '暂停视频') : t('Play', '播放视频')}</button>
      {videoError && <p className="bag-video-error">{t('Video unavailable. Explore the objects below.', '视频暂时无法播放，可以继续查看下方物件。')}</p>}
    </div>
    <div className="little-object-grid">
      <article className="little-object-card"><div className="little-object-image"><img src={assetUrl('/images/bag-preview.png')} alt={t('Mint polka-dot catgirl bag', '薄荷绿波点猫耳少女包包')} width="1242" height="1660" loading="lazy"/></div><span className="eyebrow">01 / BRINE</span><h3>{t('Mint polka-dot bag', '古早薄荷绿波点包')}</h3><Link className="pill object-detail-link" to="/bag-details">{t('View details', '点击查看详细')} <span aria-hidden="true">↗</span><span className="sr-only">{t(' — bag', '：包包')}</span></Link></article>
      <article className="little-object-card"><div className="little-object-image"><img src={assetUrl('/images/model-preview.png')} alt={t('Original catgirl figure', '原创猫耳少女模型')} width="2324" height="3098" loading="lazy"/></div><span className="eyebrow">02 / ORIGINAL IP</span><h3>{t('A little character', '原创角色模型')}</h3><Link className="pill object-detail-link" to="/model-details">{t('View details', '点击查看详细')} <span aria-hidden="true">↗</span><span className="sr-only">{t(' — figure', '：模型')}</span></Link></article>
    </div>
  </section>
}
