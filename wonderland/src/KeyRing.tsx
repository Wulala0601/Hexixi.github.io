import { useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { assetUrl } from './assets'
import type { DoorId } from './door-game'

export type KeyItem = {
  id: DoorId
  color: string
  /** 中文钥匙名，用于读屏和提示 */
  name: string
  disabled: boolean
}

type Props = {
  items: KeyItem[]
  selected: DoorId | null
  onPick: (id: DoorId) => void
  onDrop: (id: DoorId, clientX: number, clientY: number) => void
}

const DRAG_THRESHOLD = 8

/** 每把钥匙的丝带长度：故意错落，像挂在墙上一排钩子上 */
const RIBBON = [46, 86, 58, 100, 68, 78]

const keySrc = (id: DoorId) => assetUrl(`/images/keys/${id}.webp`)

/**
 * 一排钥匙：每把用彩色丝带吊着，高低错落。
 * 鼠标移上去，那一把的丝带会垂长一点；点一下拿起，或直接拖到同色的门上。
 */
export default function KeyRing({ items, selected, onPick, onDrop }: Props) {
  const [drag, setDrag] = useState<{ id: DoorId; x: number; y: number } | null>(null)
  const origin = useRef<{ x: number; y: number } | null>(null)
  const moved = useRef(false)

  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>, id: DoorId) => {
    if (event.button !== 0 && event.pointerType === 'mouse') return
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      /* 合成事件或浏览器不支持捕获时忽略 */
    }
    origin.current = { x: event.clientX, y: event.clientY }
    moved.current = false
    setDrag({ id, x: event.clientX, y: event.clientY })
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>, id: DoorId) => {
    if (!origin.current) return
    if (Math.hypot(event.clientX - origin.current.x, event.clientY - origin.current.y) > DRAG_THRESHOLD) {
      moved.current = true
    }
    setDrag({ id, x: event.clientX, y: event.clientY })
  }

  const onPointerUp = (event: ReactPointerEvent<HTMLButtonElement>, id: DoorId) => {
    const dragged = moved.current
    setDrag(null)
    origin.current = null
    moved.current = false
    if (dragged) onDrop(id, event.clientX, event.clientY)
    else onPick(id)
  }

  const draggedItem = drag ? items.find((item) => item.id === drag.id) : null

  return (
    <div className={`keyring ${drag ? 'is-dragging' : ''}`}>
      <span className="keyring-label">选一把钥匙，拖到同色的门上</span>

      <div className="keyring-stage">
        <span className="keyring-line" aria-hidden="true" />
        {items.map((item, index) => {
          const isSelected = selected === item.id
          return (
            <button
              key={item.id}
              type="button"
              className={`keyring-key ${isSelected ? 'is-selected' : ''} ${item.disabled ? 'is-used' : ''}`}
              style={{
                '--ribbon': `${RIBBON[index % RIBBON.length]}px`,
                '--key-colour': item.color,
                '--i': index,
              } as CSSProperties}
              aria-pressed={isSelected}
              aria-label={`${item.name}钥匙`}
              disabled={item.disabled}
              onPointerDown={(event) => onPointerDown(event, item.id)}
              onPointerMove={(event) => onPointerMove(event, item.id)}
              onPointerUp={(event) => onPointerUp(event, item.id)}
              onPointerCancel={() => { setDrag(null); origin.current = null; moved.current = false }}
              onClick={(event) => { if (event.detail === 0) onPick(item.id) }}
            >
              <span className="keyring-ribbon" aria-hidden="true" />
              <img className="keyring-figure" src={keySrc(item.id)} alt="" draggable={false} loading="lazy" />
              <span className="keyring-key-name">{item.name}</span>
            </button>
          )
        })}
      </div>

      {drag && draggedItem && createPortal(
        <span className="keyring-ghost" style={{ left: drag.x, top: drag.y, color: draggedItem.color }} aria-hidden="true">
          <img src={keySrc(draggedItem.id)} alt="" />
        </span>,
        document.body,
      )}
    </div>
  )
}
