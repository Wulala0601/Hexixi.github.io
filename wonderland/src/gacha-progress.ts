/** 扭蛋机进度：读门拿硬币、抽蛋、收集手办（存浏览器 localStorage） */

export type GachaState = {
  doors: string[]      // 已经读完的门
  about: boolean       // 是否读过个人简介
  spent: number        // 已经抽了几次
  figures: string[]    // 已经拿到的手办
}

const KEY = 'xixi-gacha-v1'
const EMPTY: GachaState = { doors: [], about: false, spent: 0, figures: [] }

const listeners = new Set<() => void>()
let cache: GachaState | null = null

function read(): GachaState {
  if (cache) return cache
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) {
      cache = { ...EMPTY }
      return cache
    }
    const data = JSON.parse(raw) as Partial<GachaState>
    cache = {
      doors: Array.isArray(data.doors) ? data.doors.slice(0, 6) : [],
      about: Boolean(data.about),
      spent: Math.max(0, Math.min(7, Number(data.spent) || 0)),
      figures: Array.isArray(data.figures) ? data.figures : [],
    }
  } catch {
    cache = { ...EMPTY }
  }
  return cache
}

function commit(next: GachaState) {
  cache = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* 隐私模式下写不进去，用内存里的就行 */
  }
  listeners.forEach((fn) => fn())
}

export function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}

export const getGacha = () => read()

/** 读完一扇门（点门里的项目链接时调用） */
export function markDoorRead(doorId: string) {
  const s = read()
  if (s.doors.includes(doorId)) return
  commit({ ...s, doors: [...s.doors, doorId].slice(0, 6) })
}

/** 读完个人简介 */
export function markAboutRead() {
  const s = read()
  if (s.about) return
  commit({ ...s, about: true })
}

/** 一共赚到几枚硬币 */
export const coinsEarned = (s: GachaState) => s.doors.length + (s.about ? 1 : 0)

/** 手上还有几枚没抽 */
export const coinsLeft = (s: GachaState) => Math.max(0, coinsEarned(s) - s.spent)

export type Figure = { key: string; name: string; note: string; file: string; rare?: boolean }

export const FIGURES: Figure[] = [
  { key: 'caviar', name: '鱼子酱的奇幻之夜', note: '她自己做的第一扇门 · 角色设计 / 数字艺术', file: 'figure-caviar' },
  { key: 'eve', name: '在崩解前夕', note: '动效影像 / 混合媒介', file: 'figure-eve' },
  { key: 'anicat', name: 'ANICAT', note: '品牌视觉 / 包装设计', file: 'figure-anicat' },
  { key: 'clover', name: '请躺在这里', note: '空间叙事 / 材质实验', file: 'figure-clover' },
  { key: 'atb', name: '兽华物语', note: '盲盒 IP / 品牌系统', file: 'figure-atb' },
  { key: 'brine', name: '小小的物件，大大的性格', note: '原创周边 · 可购买', file: 'figure-brine' },
  { key: 'rare', name: '金色猫耳 · 隐藏款', note: '只存在于扭蛋机里 · 读完简介才有', file: 'figure-rare', rare: true },
]

export const figureByKey = (key: string) => FIGURES.find((f) => f.key === key)

/**
 * 抽一次：
 * 前 6 次按顺序给 6 个普通款（随机顺序），第 7 次（读完简介才有）给隐藏款
 */
export function pullFigure(): Figure | null {
  const s = read()
  if (coinsLeft(s) <= 0) return null
  const owned = new Set(s.figures)
  const normals = FIGURES.filter((f) => !f.rare)
  const rare = FIGURES.find((f) => f.rare)!

  // 隐藏款只在普通款集齐之后出现
  const allNormal = normals.every((f) => owned.has(f.key))
  let pick: Figure
  if (s.about && allNormal && !owned.has(rare.key)) {
    pick = rare
  } else {
    const pool = normals.filter((f) => !owned.has(f.key))
    if (!pool.length) return null
    pick = pool[Math.floor(Math.random() * pool.length)]
  }

  commit({
    ...s,
    spent: s.spent + 1,
    figures: owned.has(pick.key) ? s.figures : [...s.figures, pick.key],
  })
  return pick
}

export function resetGacha() {
  commit({ ...EMPTY })
}
