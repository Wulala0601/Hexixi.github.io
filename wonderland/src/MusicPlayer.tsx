import { assetUrl } from './assets'
import { useEffect, useRef, useState } from 'react'
import { usePreferences } from './preferences'

export default function MusicPlayer() {
  const { sound, setSound, t } = usePreferences()
  const audio = useRef<HTMLAudioElement>(null)
  const [volume, setVolume] = useState(.4)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState(false)
  useEffect(() => {
    const player = audio.current
    if (!player) return
    let current = true
    if (sound) {
      setError(false)
      void player.play().catch(err => {
        if (current && err.name !== 'AbortError') { setError(true); setSound(false) }
      })
    } else player.pause()
    return () => { current = false }
  }, [sound, setSound])
  useEffect(() => { if (audio.current) audio.current.volume = volume }, [volume])
  const adjust = (amount: number) => setVolume(v => Math.max(0, Math.min(1, Math.round((v + amount) * 10) / 10)))
  const seek = (amount: number) => {
    const player = audio.current
    if (player && Number.isFinite(player.duration)) player.currentTime = Math.max(0, Math.min(player.duration, player.currentTime + amount))
  }
  return <aside className="music-player" aria-label={t('Miaozi music player', '喵子酱音乐播放器')}>
    <audio ref={audio} src={assetUrl('/media/miaozi-jam.mp3')} loop preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setError(true); setSound(false) }}/>
    <div className="mp3-wheel">
      <img src={assetUrl('/images/mp3-player.jpg')} alt="" width="682" height="682" draggable={false}/>
      <button className="mp3-plus" onClick={() => adjust(.1)} aria-label={t('Increase music volume', '增大音乐音量')} title={t('Volume +', '音量 +')} disabled={volume >= 1}/>
      <button className="mp3-minus" onClick={() => adjust(-.1)} aria-label={t('Decrease music volume', '减小音乐音量')} title={t('Volume −', '音量 −')} disabled={volume <= 0}/>
      <button className="mp3-play" onClick={() => setSound(!sound)} aria-label={playing ? t('Pause music', '暂停音乐') : t('Play music', '播放音乐')} aria-pressed={playing} title={playing ? t('Pause', '暂停') : t('Play', '播放')}/>
      <button className="mp3-back" onClick={() => seek(-10)} aria-label={t('Rewind music 10 seconds', '音乐后退 10 秒')} title="−10s"/>
      <button className="mp3-forward" onClick={() => seek(10)} aria-label={t('Forward music 10 seconds', '音乐前进 10 秒')} title="+10s"/>
    </div>
    <div className="mp3-readout"><strong>喵子酱 <span className={playing ? 'is-playing' : ''} aria-hidden="true">●</span></strong><output aria-live="polite">{error ? t('Tap to retry', '点击重试') : `${playing ? t('PLAYING', '播放中') : t('PAUSED', '点击播放')} · ${Math.round(volume * 100)}%`}</output></div>
  </aside>
}
