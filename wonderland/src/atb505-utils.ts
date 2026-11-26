import { assetUrl } from './assets'
import type { CastId, WorldId } from './atb505-content'

const PREFIX: Record<WorldId, string> = { tang: 'tang', broadway: 'bw', neon: 'neon' }

/** 世界线 + 角色 → public/images/atb 下的文件名 */
export function atbImageName(world: WorldId, id: CastId | 'bug'): string {
  if (id === 'bug') return 'hidden-bug'
  return `${PREFIX[world]}-${id}`
}

export const atbImage = (name: string) => assetUrl(`/images/atb/${name}.webp`)
