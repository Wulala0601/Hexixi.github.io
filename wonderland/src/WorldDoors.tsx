import { useReducer, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { imageUrl, projects } from './content'
import { usePreferences } from './preferences'
import { DoorArtwork, KeyArtwork } from './DoorArtwork'
import { doorGameReducer, initialDoorGame, type DoorId } from './door-game'
import './world-doors.css'

const doors = [
  { id: 'witch', color: '#71527f', name: ['The witch’s door', '女巫之门'], key: ['Violet', '紫黑色'], symbol: '☾' },
  { id: 'iron', color: '#bc668c', name: ['The rose iron door', '蔷薇铁艺之门'], key: ['Rose pink', '玫瑰粉'], symbol: '❧' },
  { id: 'swan', color: '#4c92b1', name: ['The swan door', '天鹅之门'], key: ['Sky blue', '天蓝色'], symbol: '◇' },
  { id: 'garden', color: '#588568', name: ['The secret garden door', '秘密花园之门'], key: ['Garden green', '花园绿'], symbol: '✿' },
] as const

export default function WorldDoors() {
  const { t, lang, reduced } = usePreferences()
  const [game, dispatch] = useReducer(doorGameReducer, initialDoorGame)
  const selected = doors.find(d => d.id === game.selected)
  const targetIndex = doors.findIndex(d => d.id === game.target)
  const target = targetIndex >= 0 ? doors[targetIndex] : null
  const status = game.feedback === 'wrong' && target
    ? t(`This lock needs the ${target.key[0].toLowerCase()} key. Try another key.`, `这扇门需要${target.key[1]}钥匙，再试一把吧。`)
    : game.feedback === 'need-key'
      ? t('First pick up a key below, then touch a door of the same color.', '先选下方的一把钥匙，再点同色的门。')
      : game.feedback === 'opened' && target
        ? t(`Welcome to ${projects[targetIndex].title.en}. Step inside the image.`, `「${projects[targetIndex].title.zh}」已打开，点击门后的图片走进去。`)
        : game.feedback === 'reset'
          ? t('All four doors are locked again. Pick a key to begin.', '四扇门已经重新上锁，选把钥匙再出发。')
          : game.feedback === 'closed'
            ? t('The door is closed. Your key is still with you.', '门已轻轻合上，钥匙还在你手里。')
            : selected
              ? t(`${selected.key[0]} key in hand. Find its matching door.`, `已拿起${selected.key[1]}钥匙，去打开同色的门吧。`)
              : t('A small ritual: choose a key, then open a door of the same color.', '一个小小的仪式：选一把钥匙，再打开同色的门。')

  const unlock = (id: DoorId) => dispatch({ type: 'unlock', id })
  return <section className={`chapter door-section door-installation ${reduced ? 'doors-reduced' : ''}`} id="worlds" data-chapter="2" aria-labelledby="doors-title">
    <header className="doors-intro">
      <span className="eyebrow">02 / FOUR DOORS, FOUR WORLDS</span>
      <h2 id="doors-title">{t('Four worlds.', '四个世界。')}<em>{t('A key to each.', '各有一把钥匙。')}</em></h2>
      <p>{t('Some stories begin with a knock. These begin with a little color.', '有些故事从敲门开始，这里的故事，从一点颜色开始。')}</p>
    </header>
    <div className="door-instructions"><span>01 · {t('Choose a key', '选择钥匙')}</span><span aria-hidden="true">⟶</span><span>02 · {t('Touch the matching door', '点同色的门')}</span><span aria-hidden="true">⟶</span><span>03 · {t('Enter the project', '走进作品')}</span></div>
    <div className={`door-feedback ${game.feedback === 'wrong' ? 'is-mismatch' : ''}`} role="status" aria-live="polite" aria-atomic="true">
      <span className="held-key-dot" style={{ background: selected?.color || '#c5bcb2' }} aria-hidden="true"/>{status}
    </div>
    <div className="doors-gallery">
      {doors.map((door, i) => {
        const project = projects[i]
        const opened = game.opened.includes(door.id)
        const chosen = game.selected === door.id
        const wrong = game.feedback === 'wrong' && game.target === door.id
        return <article className={`door-world ${opened ? 'is-open' : ''} ${chosen ? 'has-key' : ''} ${wrong ? 'wrong-key' : ''}`} key={door.id} style={{ '--door-color': door.color } as CSSProperties}>
          <div className="door-plaque"><span>0{i + 1}</span><span>{t(door.name[0], door.name[1])}</span><span aria-hidden="true">{door.symbol}</span></div>
          <div className="door-theatre">
            <div className="door-threshold"/>
            <div className="door-reveal" id={`behind-${door.id}`} aria-hidden={!opened}>
              <Link to={`/work/${project.slug}`} tabIndex={opened ? 0 : -1} aria-label={t(`Enter ${project.title.en}`, `走进${project.title.zh}`)}>
                <img src={imageUrl(project.image)} alt={project.title[lang]} loading="lazy"/>
                <span className="door-reveal-caption"><small>{t('YOU FOUND A WORLD', '你找到一个世界')}</small><strong>{project.title[lang]}</strong><span>{t('Explore the project', '查看完整项目')} ↗</span></span>
              </Link>
            </div>
            <button className="door-leaf" onClick={() => unlock(door.id)} aria-expanded={opened} aria-controls={`behind-${door.id}`} aria-label={t(`Open ${door.name[0]} · ${door.key[0]} · ${project.title.en}`, `打开${door.name[1]} · ${door.key[1]} · ${project.title.zh}`)} tabIndex={opened ? -1 : 0}>
              <DoorArtwork kind={door.id}/>
              <span className="door-knock-hint">{wrong ? t(`Use the ${door.key[0].toLowerCase()} key`, `需要${door.key[1]}钥匙`) : chosen ? t('Turn the key ↗', '转动钥匙 ↗') : t('Pick a key below', '先拿起下方钥匙')}</span>
            </button>
          </div>
          <h3>{project.title[lang]}</h3>
          <p className="door-project-type">{project.type[lang]}</p>
          <button className={`antique-key ${chosen ? 'is-selected' : ''}`} onClick={() => dispatch({ type: 'select', id: door.id })} aria-pressed={chosen} aria-label={t(`Choose ${door.key[0].toLowerCase()} key`, `选择${door.key[1]}钥匙`)}>
            <KeyArtwork kind={door.id}/>
            <span><strong>{t(door.key[0], door.key[1])}{t(' key', '钥匙')}</strong><small>{chosen ? t('In your hand', '已拿起') : t('Pick me up', '拿起钥匙')}</small></span>
          </button>
          <div className="door-underlink">{opened ? <button onClick={() => dispatch({ type: 'close', id: door.id })}>{t('Close this door', '轻轻合上门')} ↶</button> : <span>{t('Match a key to discover this world', '用同色钥匙，打开这个世界')}</span>}</div>
        </article>
      })}
    </div>
    <div className="doors-bottom"><span>{String(game.opened.length).padStart(2, '0')} / 04 · {t('WORLDS DISCOVERED', '个世界已打开')}</span><button onClick={() => dispatch({ type: 'reset' })}>{t('Lock the doors & begin again', '重新上锁 · 再玩一次')} ↶</button></div>
  </section>
}
