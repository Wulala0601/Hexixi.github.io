import { useState } from 'react'
import { links } from './content'
import './contact-page.css'

type Channel = {
  key: string
  tag: string
  name: string
  value: string
  href: string
  external?: boolean
  copy?: string
}

const CHANNELS: Channel[] = [
  {
    key: 'red',
    tag: '01 / SOCIAL',
    name: '小红书',
    value: '@何茜茜 · 看日常和草稿 ↗',
    href: links.red,
    external: true,
  },
  {
    key: 'douyin',
    tag: '02 / VIDEO',
    name: '抖音',
    value: '@何茜茜 · 过程视频 ↗',
    href: links.douyin,
    external: true,
  },
  {
    key: 'cn',
    tag: '03 / CALL · CN',
    name: '中国手机',
    value: '+86 131 2886 4697',
    href: links.mainland,
    copy: '+8613128864697',
  },
  {
    key: 'hk',
    tag: '04 / CALL · HK',
    name: '香港手机',
    value: '+852 6061 1624',
    href: links.hongkong,
    copy: '+85260611624',
  },
]

export default function ContactPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (text: string, label: string, event: React.MouseEvent) => {
    event.preventDefault()
    try {
      await navigator.clipboard.writeText(text)
      setCopied(label)
      window.setTimeout(() => setCopied(null), 1600)
    } catch {
      setCopied(null)
    }
  }

  return (
    <main className="cp">
      <div className="cp-paper" aria-hidden="true" />

      <section className="cp-hero">
        <p className="cp-eyebrow">CONTACT / SAY HELLO</p>
        <h1 className="cp-title">
          一起给你的想法
          <br />
          <em>造一个世界。</em>
        </h1>
        <p className="cp-lede">
          欢迎设计合作、工作机会、委托项目，也欢迎认真而有趣的消息。
          说清楚你想要什么、给谁看，我就能帮你想得更远一点。
        </p>

        <a className="cp-mail" href={links.email}>
          <span className="cp-mail-stamp" aria-hidden="true">✉</span>
          <span className="cp-mail-body">
            <span className="cp-mail-label">写封信给我</span>
            <strong className="cp-mail-address">xixihe@ln.hk</strong>
          </span>
          <span className="cp-mail-arrow" aria-hidden="true">↗</span>
        </a>

        <p className="cp-note">通常在 1–3 天内回复 · 深圳时间 GMT+8</p>
      </section>

      <section className="cp-cards" aria-label="其他联系方式">
        {CHANNELS.map((channel, i) => (
          <a
            key={channel.key}
            className="cp-card"
            href={channel.href}
            {...(channel.external ? { target: '_blank', rel: 'noreferrer' } : {})}
            style={{ '--i': i } as React.CSSProperties}
            onClick={channel.copy ? (event) => copy(channel.copy!, channel.key, event) : undefined}
          >
            <span className="cp-card-tag">{channel.tag}</span>
            <strong className="cp-card-name">{channel.name}</strong>
            <span className="cp-card-value">{channel.value}</span>
            {channel.copy && <span className="cp-card-hint">点一下复制</span>}
            {copied === channel.key && <span className="cp-card-done">已复制 ✓</span>}
          </a>
        ))}
      </section>

      <div className="cp-postmark" aria-hidden="true">
        <span>HE XIXI</span>
        <b>SHENZHEN · HONG KONG</b>
      </div>
    </main>
  )
}
