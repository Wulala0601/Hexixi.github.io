/** 像素小人 / 两只猫 · 点阵数据
 *  每个字符是一像素，'.' 为透明；调色板见各 sprite 的 palette。
 *  画风参考：柔和圆润的像素小人（图 4）+ 厚描边的小猫（图 5）。
 */

export type Sprite = { rows: string[]; palette: Record<string, string> }

/** 行宽不齐时右侧补透明，避免错位 */
const fix = (rows: string[]): string[] => {
  const w = Math.max(...rows.map((r) => r.length))
  return rows.map((r) => r.padEnd(w, '.'))
}

const sprite = (palette: Record<string, string>, rows: string[]): Sprite => ({ palette, rows: fix(rows) })

/** 何茜茜：黑长直 + 齐刘海 + 薄荷绿长袖 + 黑白条纹短裤 + 白泡泡袜 + 薄荷洞洞鞋 */
export const GIRL = sprite(
  {
    o: '#241d2b',
    H: '#1b1a22',
    h: '#33323d',
    S: '#f3d5c0',
    s: '#d9b7a1',
    e: '#2b2430',
    r: '#f3a8c0',
    m: '#b6707c',
    T: '#9fe3d0',
    t: '#6cc2ab',
    K: '#2b2b33',
    W: '#f8f7f3',
    w: '#d8d6ce',
    C: '#8fdcc6',
    c: '#57b49c',
  },
  [
    '.....HHHHHHHH.....',
    '...HHHHHHHHHHHH...',
    '..HHHHHHHHHHHHHH..',
    '..HHHHHHHHHHHHHH..',
    '..HHHHHHHHHHHHHH..',
    '..HHSSSSSSSSSSHH..',
    '..HHSSSSSSSSSSHH..',
    '..HHSSeeSSeeSSHH..',
    '..HHSSSSSSSSSSHH..',
    '..HHSSrSSSSrSSHH..',
    '..HHSSSSmmSSSSHH..',
    '..HHHSSSSSSSSHHH..',
    '..HHHHSSSSSSHHHH..',
    '..HHHHHHHHHHHHHH..',
    '..hHHHHHHHHHHHHh..',
    '...TTTTTTTTTTTT...',
    '..TTTTTTTTTTTTTT..',
    '..TtTTTTTTTTTTtT..',
    '..TtTTTTTTTTTTtT..',
    '..StTTTTTTTTTTtS..',
    '...tTTTTTTTTTTt...',
    '...KKKKKKKKKKKK...',
    '...WWWWWWWWWWWW...',
    '...KKKKKKKKKKKK...',
    '....SSSSSSSSSS....',
    '....SSSSSSSSSS....',
    '...WWWWWWWWWWWW...',
    '...WwWWWWWWWWwW...',
    '...CcCCCCCCCCcC...',
    '..cCCCCCCCCCCCCc..',
  ],
)

/** 鱼子酱：奶牛猫（黑身、白嘴白胸白爪、浅绿眼）+ 蓝白格子围脖 */
export const FISH = sprite(
  {
    o: '#121018',
    B: '#22222c',
    b: '#343442',
    W: '#f6f3ea',
    P: '#e88ba8',
    G: '#c9e87a',
    i: '#2f4a22',
    L: '#9cc0e8',
    l: '#6d95cc',
  },
  [
    '..........o..o......',
    '.........oBoBo......',
    '........oBBBBBBo....',
    '.......oBBBBBBBBo...',
    '.......oBGiBBGiBBo..',
    '.......oBBBPBBBBBo..',
    '......oBBWWWWWWBBo..',
    '.....oBBBWWWWWWBBBo.',
    '....oBBBBLWWLWWBBBBo',
    '...oBBBBBLLLLLLBBBBo',
    '...oBBBBBBBBBBBBBBBo',
    '...oBWBBBBBBBBBBBWBo',
    '...oWWooWWooWWooWWoo',
    '....ooooooooooooooo.',
  ],
)

/** 小贝：胖狸花（灰褐底 + 深虎斑、白嘴）+ 粉色围兜 */
export const BEI = sprite(
  {
    o: '#241c16',
    M: '#bda687',
    m: '#9a8469',
    D: '#6b5744',
    W: '#f4efe4',
    P: '#f3b6c8',
    p: '#d98aa0',
    G: '#93c24e',
    i: '#2f4a22',
  },
  [
    '.........o..o........',
    '.......ooMMooMMo.....',
    '......oMMMMMMMMMo....',
    '.....oMDMMMDMMMDMo...',
    '.....oMMDMMMDMMMDMo..',
    '.....oMGiMMMMGiMMMo..',
    '.....oMMPPMMPPMMMMo..',
    '....oMMWWWWWWWWMMMo..',
    '...oMPPWWWWWWWWPPMo..',
    '..oMMMPPWWWWWWPPMMMo.',
    '..oMMDMMDMMDMMDMMDMMo',
    '..oMMMMMMMMMMMMMMMMMo',
    '..oWMMWMMWMMWMMWMMMWo',
    '..oWWoWWoWWoWWoWWoWWo',
    '...ooooooooooooooooo.',
  ],
)

/** 猫尾巴（画在身体后面）：朝左翘起 */
export const TAIL_BLACK = sprite(
  { o: '#121018', B: '#22222c', b: '#343442' },
  [
    '..o.',
    '.oBo',
    '.oBo',
    'oBBo',
    'oBBo',
    '.oBo',
    '..oo',
  ],
)

export const TAIL_TABBY = sprite(
  { o: '#241c16', M: '#bda687', D: '#6b5744' },
  [
    '..o.',
    '.oDo',
    '.oMo',
    'oMMo',
    'oMDo',
    '.oMo',
    '..oo',
  ],
)