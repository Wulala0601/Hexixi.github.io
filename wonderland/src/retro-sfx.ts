/** 8-bit 风格音效：全部用 WebAudio 现场合成，不依赖音频文件 */

let ctx: AudioContext | null = null

function ac(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

type ToneOpts = {
  freq: number
  to?: number
  dur?: number
  type?: OscillatorType
  gain?: number
  delay?: number
}

function tone({ freq, to, dur = 0.12, type = 'square', gain = 0.16, delay = 0 }: ToneOpts) {
  const c = ac()
  if (!c) return
  const t0 = c.currentTime + delay
  const osc = c.createOscillator()
  const amp = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (to) osc.frequency.exponentialRampToValueAtTime(Math.max(40, to), t0 + dur)
  amp.gain.setValueAtTime(0.0001, t0)
  amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.012)
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(amp).connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

function noise(dur = 0.12, gain = 0.12, delay = 0, lowpass = 2400) {
  const c = ac()
  if (!c) return
  const t0 = c.currentTime + delay
  const len = Math.floor(c.sampleRate * dur)
  const buf = c.createBuffer(1, len, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / len)
  const src = c.createBufferSource()
  src.buffer = buf
  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = lowpass
  const amp = c.createGain()
  amp.gain.value = gain
  src.connect(filter).connect(amp).connect(c.destination)
  src.start(t0)
}

export const sfx = {
  /** 鼠标点一下的轻响 */
  tick() {
    tone({ freq: 880, to: 660, dur: 0.06, gain: 0.07, type: 'triangle' })
  },
  /** 投币 */
  coin() {
    tone({ freq: 1046, dur: 0.09, gain: 0.14 })
    tone({ freq: 1568, dur: 0.14, gain: 0.12, delay: 0.07 })
  },
  /** 转把手：一串棘轮咔哒 */
  crank() {
    for (let i = 0; i < 9; i += 1) {
      noise(0.05, 0.09, i * 0.075, 3200)
      tone({ freq: 220 + i * 8, dur: 0.05, gain: 0.05, type: 'square', delay: i * 0.075 })
    }
  },
  /** 扭蛋掉出来 */
  drop() {
    tone({ freq: 260, to: 110, dur: 0.22, gain: 0.18, type: 'sine' })
    noise(0.09, 0.12, 0.02, 1200)
  },
  /** 打开蛋壳 */
  pop() {
    noise(0.07, 0.16, 0, 3600)
    tone({ freq: 620, to: 1180, dur: 0.16, gain: 0.12, type: 'square', delay: 0.02 })
  },
  /** 收获小音阶 */
  fanfare(rare = false) {
    const notes = rare ? [784, 988, 1175, 1568] : [659, 784, 988]
    notes.forEach((f, i) => tone({ freq: f, dur: 0.18, gain: 0.13, type: 'square', delay: i * 0.12 }))
  },
  /** 拖动把手时的一下轻响 */
  crankTick() {
    noise(0.03, 0.05, 0, 3800)
  },
  /** 打开时的小星光 */
  sparkle() {
    [1320, 1568, 1864, 2093].forEach((freq, i) => tone({ freq, dur: 0.12, gain: 0.08, type: 'triangle', delay: i * 0.06 }))
  },
  /** 放进磁带机：咔哒 + 马达 */
  insert() {
    noise(0.08, 0.14, 0, 1800)
    tone({ freq: 180, to: 240, dur: 0.3, gain: 0.08, type: 'sawtooth', delay: 0.08 })
  },
}
