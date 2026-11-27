import { useReducer, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { imageUrl, projects } from './content'
import { assetUrl } from './assets'
import { usePreferences } from './preferences'
import KeyRing from './KeyRing'
import { doorGameReducer, initialDoorGame, type DoorId } from './door-game'
import './world-doors.css'
import './doors-v2.css'
import './worlds-street.css'

type DoorDef = {
  id: DoorId
  slug: string
  color: string
  name: [string, string]
  key: [string, string]
  symbol: string
}

const doors: DoorDef[] = [
  { id: 'witch', slug: 'caviar', color: '#4a6b46', name: ['The witch’s door', '女巫之门'], key: ['Forest green', '墨绿'], symbol: '☾' },
  { id: 'iron', slug: 'on-the-eve', color: '#c98a9c', name: ['The rose iron door', '蔷薇铁艺之门'], key: ['Rose pink', '玫瑰粉'], symbol: '❧' },
  { id: 'swan', slug: 'anicat', color: '#8fb6c8', name: ['The swan door', '天鹅之门'], key: ['Sky blue', '天蓝色'], symbol: '◇' },
  { id: 'garden', slug: 'please-lie-here', color: '#b2434f', name: ['The secret garden door', '秘密花园之门'], key: ['Strawberry', '草莓红'], symbol: '✿' },
  { id: 'crate', slug: 'atb505', color: '#a9743f', name: ['The travelling trunk', '旧手提箱之门'], key: ['Amber', '琥珀金'], symbol: '✦' },
  { id: 'shop', slug: 'shop', color: '#7fc4b4', name: ['The little shop window', '小小商店之门'], key: ['Mint', '薄荷绿'], symbol: '❋' },
]

/** 第六扇门通向商店，不是项目页，所以这里补一份标题信息 */
const SHOP_META = {
  title: { en: 'Little objects, big personality', zh: '小小的物件，大大的性格' },
  type: { en: 'ORIGINAL GOODS / SHOP', zh: '原创周边 · 可购买' },
  image: 'bag-front',
}

function metaFor(slug: string) {
  const found = projects.find((item) => item.slug === slug)
  if (found) return { title: found.title, type: found.type, image: found.image }
  return { title: SHOP_META.title, type: SHOP_META.type, image: SHOP_META.image }
}

const hrefFor = (slug: string) => (slug === 'shop' ? '/shop' : `/work/${slug}`)

/** 街景：远处楼房（左%、宽%、高 px）与路灯位置 */
const SKYLINE: [number, number, number][] = [
  [1, 7, 58], [8, 5, 86], [14, 9, 46], [24, 6, 72], [31, 8, 98], [40, 5, 60],
  [46, 10, 78], [57, 5, 50], [63, 8, 90], [72, 6, 62], [79, 9, 74], [89, 8, 54],
]
const LAMPS = [2.5, 96]

export default function WorldDoors() {
  const { t, lang, reduced } = usePreferences()
  const [game, dispatch] = useReducer(doorGameReducer, initialDoorGame)
  const [hint, setHint] = useState<string | null>(null)

  const selected = doors.find((door) => door.id === game.selected)
  const targetIndex = doors.findIndex((door) => door.id === game.target)
  const target = targetIndex >= 0 ? doors[targetIndex] : null
  const targetMeta = target ? metaFor(target.slug) : null

  const status = hint
    ? hint
    : game.feedback === 'wrong' && target
      ? t(`This lock needs the ${target.key[0].toLowerCase()} key. Try another one.`, `这扇门需要${target.key[1]}钥匙，换一把试试。`)
      : game.feedback === 'need-key'
        ? t('Take a key from the ring first, then drag it onto a door of the same color.', '先从钥匙扣上取一把钥匙，再拖到同色的门上。')
        : game.feedback === 'opened' && target && targetMeta
          ? t(`Welcome to ${targetMeta.title.en}. Step inside the image.`, `「${targetMeta.title.zh}」已打开，点击门后的图片走进去。`)
          : game.feedback === 'reset'
            ? t('All six doors are locked again. Pick a key to begin.', '六扇门已经重新上锁，选把钥匙再出发。')
            : game.feedback === 'closed'
              ? t('The door is closed. Your key is still with you.', '门已轻轻合上，钥匙还在你手里。')
              : selected
                ? t(`${selected.key[0]} key in hand. Drag it onto the matching door.`, `${selected.key[1]}钥匙在你手里，把它拖到同色的门上。`)
                : t('A small ritual: pick up a key, then drag it onto the door of the same color.', '一个小小的仪式：拿起一把钥匙，拖到同色的门上。')

  const pick = (id: DoorId) => {
    setHint(null)
    dispatch({ type: 'select', id })
  }

  const drop = (keyId: DoorId, clientX: number, clientY: number) => {
    const element = document.elementFromPoint(clientX, clientY)
    const dropTarget = element?.closest<HTMLElement>('[data-door-id]')
    const doorId = dropTarget?.dataset.doorId as DoorId | undefined
    dispatch({ type: 'select', id: keyId })
    if (!doorId) {
      setHint(t('Drop the key right on a door to unlock it.', '要把钥匙拖到门上松手，才能开锁。'))
      return
    }
    setHint(null)
    dispatch({ type: 'unlock', id: doorId })
  }

  return (
    <section className={`chapter door-section door-installation ${reduced ? 'doors-reduced' : ''}`} id="worlds" data-chapter="2" aria-labelledby="doors-title">
      <header className="doors-intro">
        <span className="eyebrow">02 / SIX DOORS, SIX WORLDS</span>
        <h2 id="doors-title">{t('Six worlds.', '六个世界。')}<em>{t('A key to each.', '各有一把钥匙。')}</em></h2>
        <p>{t('Some stories begin with a knock. These begin with a key in your hand.', '有些故事从敲门开始，这里的故事，从你手上的一把钥匙开始。')}</p>
      </header>

      <div className="door-instructions">
        <span>01 · {t('Take a key from the ring', '从钥匙扣拿起钥匙')}</span>
        <span aria-hidden="true">⟶</span>
        <span>02 · {t('Drag it onto the matching door', '拖到同色的门上')}</span>
        <span aria-hidden="true">⟶</span>
        <span>03 · {t('Step into the world', '走进这个世界')}</span>
      </div>

      <div className={`door-feedback ${game.feedback === 'wrong' ? 'is-mismatch' : ''}`} role="status" aria-live="polite" aria-atomic="true">
        <span className="held-key-dot" style={{ background: selected?.color || '#c5bcb2' }} aria-hidden="true" />
        {status}
      </div>

      <KeyRing
        items={doors.map((door) => ({
          id: door.id,
          color: door.color,
          name: door.key[1],
          disabled: game.opened.includes(door.id),
        }))}
        selected={game.selected}
        onPick={pick}
        onDrop={drop}
      />

      <div className="street">
        <div className="street-sky" aria-hidden="true">
          <span className="street-sun" />
          {SKYLINE.map(([left, width, height], i) => (
            <i key={i} style={{ left: `${left}%`, width: `${width}%`, height: `${height}px` }} />
          ))}
        </div>

        <div className="doors-gallery">
        {doors.map((door, i) => {
          const meta = metaFor(door.slug)
          const opened = game.opened.includes(door.id)
          const armed = game.selected === door.id
          const wrong = game.feedback === 'wrong' && game.target === door.id
          return (
            <article
              className={`door-world ${opened ? 'is-open' : ''} ${armed ? 'has-key' : ''} ${wrong ? 'wrong-key' : ''}`}
              key={door.id}
              data-door-id={door.id}
              style={{ '--door-color': door.color } as CSSProperties}
            >
              <div className="door-plaque"><span>0{i + 1}</span><span>{t(door.name[0], door.name[1])}</span><span aria-hidden="true">{door.symbol}</span></div>
              <div className="door-theatre">
                <div className="door-threshold" />
                <div className="door-reveal" id={`behind-${door.id}`} aria-hidden={!opened}>
                  <Link to={hrefFor(door.slug)} tabIndex={opened ? 0 : -1} aria-label={t(`Enter ${meta.title.en}`, `走进${meta.title.zh}`)}>
                    <img src={imageUrl(meta.image)} alt={meta.title[lang]} loading="lazy" />
                    <span className="door-reveal-caption">
                      <small>{t('YOU FOUND A WORLD', '你找到一个世界')}</small>
                      <strong>{meta.title[lang]}</strong>
                      <span>{door.slug === 'shop' ? t('Open the shop', '去商店看看') : t('Explore the project', '查看完整项目')} ↗</span>
                    </span>
                  </Link>
                </div>
                <button
                  className="door-leaf"
                  onClick={() => { setHint(null); dispatch({ type: 'unlock', id: door.id }) }}
                  aria-expanded={opened}
                  aria-controls={`behind-${door.id}`}
                  aria-label={t(`Open ${door.name[0]} with the ${door.key[0].toLowerCase()} key`, `用${door.key[1]}钥匙打开${door.name[1]}`)}
                  tabIndex={opened ? -1 : 0}
                >
                  <img
                    className="door-photo"
                    src={assetUrl(`/images/doors/${door.id}.webp`)}
                    alt=""
                    loading="lazy"
                  />
                  <span className="door-knock-hint">
                    {wrong
                      ? t(`Use the ${door.key[0].toLowerCase()} key`, `需要${door.key[1]}钥匙`)
                      : armed
                        ? t('Drop the key here', '把钥匙放这里')
                        : t(`Needs the ${door.key[1]} key`, `需要${door.key[1]}钥匙`)}
                  </span>
                </button>
              </div>
              <h3>{meta.title[lang]}</h3>
              <p className="door-project-type">{meta.type[lang]}</p>
              <div className="door-underlink">
                {opened
                  ? <button onClick={() => dispatch({ type: 'close', id: door.id })}>{t('Close this door', '轻轻合上门')} ↶</button>
                  : <span className="door-key-tag" style={{ '--door-color': door.color } as CSSProperties}>{t(door.key[0], door.key[1])}{t(' key', '钥匙')}</span>}
              </div>
            </article>
          )
        })}
        </div>

        <div className="street-floor" aria-hidden="true">
          <span className="street-sidewalk" />
          <span className="street-road" />
          {LAMPS.map((left, i) => (
            <span className="street-lamp" key={i} style={{ left: `${left}%` }} />
          ))}
        </div>
      </div>

      <div className="doors-bottom">
        <span>{String(game.opened.length).padStart(2, '0')} / 06 · {t('WORLDS DISCOVERED', '个世界已打开')}</span>
        <button onClick={() => { setHint(null); dispatch({ type: 'reset' }) }}>{t('Lock the doors & begin again', '重新上锁 · 再玩一次')} ↶</button>
      </div>
    </section>
  )
}
