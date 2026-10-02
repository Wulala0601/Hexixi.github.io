import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
export type Lang = 'en' | 'zh'
export type Quality = 'high' | 'balanced' | 'lite'
export type Bi = { en: string; zh: string }
const read = (key: string) => { try { return localStorage.getItem(key) } catch { return null } }
const save = (key: string, value: string) => { try { localStorage.setItem(key, value) } catch { /* Private browsing remains usable. */ } }
export const recommendedQuality: Quality = typeof navigator !== 'undefined' && (navigator.hardwareConcurrency <= 4 || window.innerWidth < 700) ? 'lite' : 'balanced'
type Preferences = { lang: Lang; setLang: (lang: Lang) => void; quality: Quality; setQuality: (quality: Quality) => void; reduced: boolean; setReduced: (value: boolean) => void; sound: boolean; setSound: (value: boolean) => void; skip3d: boolean; setSkip3d: (value: boolean) => void; t: (en: string, zh: string) => string }
const Context = createContext<Preferences>(null!)
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [lang, updateLang] = useState<Lang>(() => read('he-lang') === 'zh' || (!read('he-lang') && navigator.language.startsWith('zh')) ? 'zh' : 'en')
  const [quality, updateQuality] = useState<Quality>(() => { const value = read('he-quality'); return value === 'high' || value === 'balanced' || value === 'lite' ? value : recommendedQuality })
  const [reduced, updateReduced] = useState(() => read('he-reduced') ? read('he-reduced') === 'true' : matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [sound, setSound] = useState(false)
  const [skip3d, setSkip3d] = useState(new URLSearchParams(location.search).has('no3d'))
  const setLang = (value: Lang) => { updateLang(value); save('he-lang', value) }
  const setQuality = (value: Quality) => { updateQuality(value); save('he-quality', value) }
  const setReduced = (value: boolean) => { updateReduced(value); save('he-reduced', String(value)) }
  useEffect(() => { document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'; document.documentElement.dataset.motion = reduced ? 'reduced' : 'full' }, [lang, reduced])
  useEffect(() => { const query = matchMedia('(prefers-reduced-motion: reduce)'); const change = () => { if (!read('he-reduced')) updateReduced(query.matches) }; query.addEventListener('change', change); return () => query.removeEventListener('change', change) }, [])
  return <Context.Provider value={{ lang, setLang, quality, setQuality, reduced, setReduced, sound, setSound, skip3d, setSkip3d, t: (en, zh) => lang === 'en' ? en : zh }}>{children}</Context.Provider>
}
export const usePreferences = () => useContext(Context)
