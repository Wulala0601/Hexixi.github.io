/** 鱼子酱的奇幻夜 · 内容层（来自 PPT：万圣节限定盲盒 NFT 收藏系列） */

export const meta = {
  title: { zh: '鱼子酱的奇幻夜', en: "Caviar's Fantasy Night" },
  subtitle: { zh: '万圣节限定盲盒 NFT 收藏系列', en: 'A Halloween Limited Blind Box NFT Collection' },
  edition: 3500,
  price: 18,
  platform: '鲸探 App',
  mode: { zh: '个人空间展台 / 摆件', en: 'Personal space booth & ornament' },
  roles: ['平面设计', 'AI 生成', '盲盒机制设计', '发行方案'],
  year: '2025',
}

export const film = {
  src: '/videos/caviar/film.mp4',
  poster: '/images/caviar/film-poster.jpg',
  caption: '《鱼子酱的奇幻夜》概念短片 · 35 秒',
}

export const inspiration = {
  zh: '灵感来自我自己养的猫，叠上万圣节的流量风口，用 Midjourney 生成画面，以盲盒抽卡作为发行方式，做成一整套可以上架发售的 NFT 艺术商品。',
  en: 'The inspiration comes from my own cat, timed to Halloween. Using Midjourney as the creative medium and a blind-box gacha as the distribution model, the project became a complete NFT art collection.',
}

export const worldview = {
  zh: '以万圣节哥特美学为基底，构建了一个暗夜童话宇宙：魔法森林与哥特古堡交织，南瓜灯在迷雾中指引方向，蝙蝠与乌鸦穿梭于月光之下。所有万圣节元素都被赋予了新的生命。',
  en: 'Built on Halloween gothic aesthetics: enchanted forests tangled with gothic castles, pumpkin lanterns guiding the way through mist, bats and ravens crossing the moonlight.',
}

export const philosophy = {
  zh: '把猫咪的优雅灵动与哥特的暗黑浪漫融合：食人花的张扬、女巫坩埚的神秘、幽灵的飘逸，重构猫咪的日常姿态。深色中点缀绚烂色彩——神秘之下藏着温柔，黑暗之中孕育生机。',
  en: 'Cat elegance meets gothic romance. Carnivorous plants, witch cauldrons and drifting ghosts restage the everyday postures of a cat: tenderness beneath mystery, life inside the dark.',
}

export type Item = {
  id: string
  name: { zh: string; en: string }
  rate: number
  edition: number
  gif: string
  poster: string
  desc: { zh: string; en: string }
  tag: string
}

/** 三款常规款（PPT 概率：50% / 30% / 20%） */
export const items: Item[] = [
  {
    id: 'phantom',
    name: { zh: '幽灵舞会领舞者', en: 'Phantom Ball Lead Dancer' },
    rate: 50,
    edition: 1750,
    gif: 'phantom',
    poster: 'phantom-poster',
    tag: '常规款',
    desc: {
      zh: '猫咪身着蛛网白纱，与幽灵在月光下轻盈起舞；背景里蝙蝠盘旋，南瓜灯在墓碑间闪烁。',
      en: 'A cat in cobweb gauze dances with a phantom under the moon, bats circling as pumpkin lanterns glow among the tombstones.',
    },
  },
  {
    id: 'witch',
    name: { zh: '破壳小魔女', en: "Pumpkin's Little Witch" },
    rate: 30,
    edition: 1050,
    gif: 'witch',
    poster: 'witch-poster',
    tag: '常规款',
    desc: {
      zh: '哥特街道上，小猫从巨型南瓜中跃出，手持魔法棒、头戴尖顶帽，夜空蝙蝠盘旋。',
      en: 'On a gothic street a kitten bursts out of a giant pumpkin, wand in paw and pointed hat on, bats wheeling overhead.',
    },
  },
  {
    id: 'apprentice',
    name: { zh: '魔药小学徒', en: 'Potion Apprentice' },
    rate: 20,
    edition: 700,
    gif: 'apprentice',
    poster: 'apprentice-poster',
    tag: '常规款',
    desc: {
      zh: '魔药实验室里，戴尖顶帽与黑框眼镜的小猫抱着魔法古籍，坩埚里喷出彩虹瀑布与彩色泡泡。',
      en: 'In the potion lab, a bespectacled apprentice hugs a spellbook while the cauldron erupts into a rainbow cascade of bubbles.',
    },
  },
]

/** 空投款：集齐三款 + 往期《蛛蜜惊糖》 */
export const airdrop = {
  id: 'parade',
  name: { zh: '奇幻夜巡游', en: 'Fantasy Night Parade' },
  gif: 'parade',
  poster: 'parade-poster',
  rule: { zh: '集齐三款常规款 + 往期《蛛蜜惊糖》', en: 'Collect all three plus the previous Web-Dusted Delight' },
  desc: {
    zh: '身着礼服的小猫推着魔法扫帚车，车头张开大嘴的食人花活灵活现；幽绿森林与发光蘑菇映出神秘光芒。',
    en: 'A kitten conductor pushes a broom cart, a carnivorous plant yawning at its front, framed by a glowing green forest.',
  },
}

/** 往期藏品（已持有） */
export const previous = {
  id: 'previous',
  name: { zh: '蛛蜜惊糖', en: 'Web-Dusted Delight' },
  desc: { zh: '往期藏品 · 集齐后可获得空投资格', en: 'Previous release — required for the airdrop' },
}

/** 隐藏款 */
export const hidden = {
  id: 'hidden',
  name: { zh: '隐藏款 · 鱼子酱', en: 'Hidden Edition — Caviar' },
  desc: {
    zh: '整只猫本尊：绿丝绒长裙、尖顶巫师帽，坐在月光下的南瓜田边。抽到的概率比常规款窄得多。',
    en: 'The cat herself: green velvet dress, pointed hat, waiting at the edge of the pumpkin field under the moon.',
  },
  odds: '1 / 60',
}

export const values = [
  {
    title: { zh: '独特性', en: 'Uniqueness' },
    text: {
      zh: '以展台与摆件为切入点的藏品——它不是一个躺在钱包里的图，而是能摆进个人空间的一件小雕塑。',
      en: 'A collectible pitched as a display piece: not an image sitting in a wallet, but a small sculpture for your own space.',
    },
  },
  {
    title: { zh: '参与感', en: 'Involvement' },
    text: {
      zh: '图鉴玩法让收藏者不只是买一个好看的藏品，而是通过收集去解锁隐藏内容，拉高可玩性与期待值。',
      en: 'The illustrated index turns buying into playing: collecting unlocks hidden content, raising playability and anticipation.',
    },
  },
  {
    title: { zh: '需求感', en: 'Demand' },
    text: {
      zh: '每位藏友都可以按自己的喜好更换展台，装饰自己的空间——这代年轻人的一种必需品。',
      en: 'Collectors swap booths to decorate their own space — an essential for this generation.',
    },
  },
]

export const timeline = [
  { label: { zh: '灵感与 IP 设定', en: 'Concept & IP' }, text: { zh: '以猫为原型，锁定万圣节档期', en: 'Cat as the model, Halloween as the window' } },
  { label: { zh: '画面生成', en: 'Image making' }, text: { zh: 'Midjourney 生成，逐张调整光影与构图', en: 'Midjourney, with per-image tuning' } },
  { label: { zh: '盲盒与发行', en: 'Blind box & release' }, text: { zh: '三款权重 50/30/20，共 3500 份', en: 'Weights 50/30/20, 3,500 editions' } },
  { label: { zh: '上架', en: 'Launch' }, text: { zh: '鲸探 App 发售，18 元/份', en: 'Released on WhaleTalk at ¥18' } },
]
