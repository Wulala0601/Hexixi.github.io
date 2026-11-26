import { useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { KeyArtwork } from './DoorArtwork'
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

/**
 * 钥匙扣：平时五/六把钥匙叠在一起，鼠标移上去扇开。
 * 点一下拿起（或直接拖走），拖到同色的门上方松手即可开锁。
 */
export default function KeyRing({ items, selected, onPick, onDrop }: Props) {
  const [open, setOpen] = useState(false)
  const [drag, setDrag] = useState<{ id: DoorId; x: number; y: number } | null>(null)
  const origin = useRef<{ x: number; y: number } | null>(null)
  const moved = useRef(false)

  const span = Math.min(56, 9.5 * items.length)
  const center = (items.length - 1) / 2

  const angleOf = (index: number) => (index - center) * (span / Math.max(1, center))
  const offsetOf = (index: number) => (index - center) * 22

  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>, id: DoorId) => {
    if (event.button !== 0 && event.pointerType === 'mouse') return
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      /* 合成事件或浏览器不支持捕获时忽略，拖动仍然可用 */
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
    <div
      className={`keyring ${open ? 'is-open' : ''} ${drag ? 'is-dragging' : ''}`}
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => { if (!drag) setOpen(false) }}
      data-open={open}
    >
      <span className="keyring-label">
        {open ? '选一把钥匙，拖到同色的门上' : '把鼠标放上来，取出钥匙'}
      </span>
      <div className="keyring-stage" onPointerEnter={() => setOpen(true)}>
        <span className="keyring-hoop" aria-hidden="true" />
        {items.map((item, index) => {
          const isSelected = selected === item.id
          return (
            <button
              key={item.id}
              type="button"
              className={`keyring-key ${isSelected ? 'is-selected' : ''} ${item.disabled ? 'is-used' : ''}`}
              style={{ '--angle': `${angleOf(index)}deg`, '--dx': `${offsetOf(index)}px`, '--i': index, '--key-colour': item.color } as CSSProperties}
              aria-pressed={isSelected}
              aria-label={`${item.name}钥匙`}
              disabled={item.disabled}
              onPointerDown={(event) => onPointerDown(event, item.id)}
              onPointerMove={(event) => onPointerMove(event, item.id)}
              onPointerUp={(event) => onPointerUp(event, item.id)}
              onPointerCancel={() => { setDrag(null); origin.current = null; moved.current = false }}
              onClick={(event) => { if (event.detail === 0) onPick(item.id) }}
            >
              <KeyArtwork kind={item.id} />
              <span className="keyring-key-name">{item.name}</span>
            </button>
          )
        })}
      </div>

      {drag && draggedItem && createPortal(
        <span className="keyring-ghost" style={{ left: drag.x, top: drag.y, color: draggedItem.color }} aria-hidden="true">
          <KeyArtwork kind={draggedItem.id} />
        </span>,
        document.body,
      )}
    </div>
  )
}
