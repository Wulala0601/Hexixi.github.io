import { useEffect, useRef, useState } from 'react'
import { assetUrl } from './assets'

type Props = {
  /** public 下的路径，例如 /videos/atb/tang.mp4 */
  src: string
  poster: string
  caption: string
  label?: string
}

/**
 * 场景短片：进入视口才播放，离开暂停；系统开启「减少动态效果」时不自动播放，
 * 只显示海报和播放按钮。
 */
export default function SceneVideo({ src, poster, caption, label }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
          } else {
            el.pause()
            setPlaying(false)
          }
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const toggle = () => {
    const el = ref.current
    if (!el) return
    if (el.paused) {
      void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    } else {
      el.pause()
      setPlaying(false)
    }
  }

  return (
    <figure className="atb-scene atb-scene-video">
      <div className="atb-video">
        <video
          ref={ref}
          src={assetUrl(src)}
          poster={assetUrl(poster)}
          muted
          loop
          playsInline
          preload="metadata"
        />
        <button
          type="button"
          className="atb-video-toggle"
          onClick={toggle}
          aria-label={playing ? `暂停${caption}` : `播放${caption}`}
        >
          <span aria-hidden="true">{playing ? '❚❚' : '▶'}</span>
        </button>
        {label && <span className="atb-video-badge">{label}</span>}
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  )
}
