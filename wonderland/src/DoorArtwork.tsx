import { useId } from 'react'
import type { DoorId } from './door-game'

const arch = 'M17 351V99C17-12 183-12 183 99V351Z'
const inset = 'M30 337V100C30 7 170 7 170 100V337Z'
const curl = 'M0 0C-27-15-33-47-12-60C8-73 30-50 16-36C4-23-11-37-3-43'

function Rose({ x, y, size = 1, shade = '#f6cccf' }: { x: number; y: number; size?: number; shade?: string }) {
  return <g transform={`translate(${x} ${y}) scale(${size})`}>
    <path d="M0 8Q-25 3-20-12Q-5-14 0 0Q8-23 21-13Q19 5 3 8Z" fill="#6b8760" stroke="#304a35" strokeWidth=".8"/>
    {[0,60,120,180,240,300].map(a => <ellipse key={a} cx="0" cy="-5" rx="7.5" ry="9" transform={`rotate(${a})`} fill={shade} stroke="#c993a0" strokeWidth=".8"/>)}
    <path d="M-6 1C-10-10 9-10 7 1C7 10-6 8-5 0C-4-6 5-4 3 1C2 5-2 4-2 1" fill="none" stroke="#b47e91" strokeWidth="1.3"/>
  </g>
}

export function DoorArtwork({ kind }: { kind: DoorId }) {
  const id = useId().replace(/:/g, '')
  const colors = { witch: ['#62606c','#26232d','#43404d'], iron: ['#e7afc5','#a75a7c','#cf8aaa'], swan: ['#e1f5fa','#79abc0','#b6dce9'], garden: ['#9da883','#425d43','#70866a'] }[kind]
  return <svg viewBox="0 0 200 360" aria-hidden="true" focusable="false">
    <defs>
      <path id={`${id}-curl`} d={curl}/>
      <linearGradient id={`${id}-wood`} x1="0" x2="1" y1="0" y2=".4"><stop stopColor={colors[0]}/><stop offset=".18" stopColor={colors[2]}/><stop offset=".72" stopColor={colors[2]}/><stop offset="1" stopColor={colors[1]}/></linearGradient>
      <linearGradient id={`${id}-glass`} x2=".8" y2="1"><stop stopColor={kind==='swan'?'#536d79':'#2b2333'}/><stop offset=".52" stopColor={kind==='swan'?'#273e4c':'#473142'}/><stop offset="1" stopColor="#192e28"/></linearGradient>
      <linearGradient id={`${id}-silver`}><stop stopColor="#8d8a76"/><stop offset=".3" stopColor="#ffffe8"/><stop offset=".6" stopColor="#d0c6ac"/><stop offset="1" stopColor="#79796f"/></linearGradient>
      <pattern id={`${id}-grain`} width="12" height="70" patternUnits="userSpaceOnUse"><path d="M3 0Q0 22 4 45T4 70M9 0Q13 35 8 70" stroke="#ffffff" strokeOpacity=".09" fill="none" strokeWidth=".6"/></pattern>
      <g id={`${id}-raven`}><path d="M-24 13Q-2 4 2-16Q3-31 15-27Q23-24 23-18L35-13L22-12Q25 4 15 13Q3 23-12 20L-35 33L-28 13Z" fill="#171923" stroke="#6d647a" strokeWidth="1.2"/><path d="M9-7Q-14 4-19 16Q3 18 14 5M-15 12L7 3M-10 17L11 7" fill="none" stroke="#5e6273" strokeWidth="1.4"/><circle cx="16" cy="-20" r="1.3" fill="#d9cab7"/><path d="M2 19L0 30M11 18L13 28M-5 30H7M8 28H19" stroke="#37303b" strokeWidth="2"/></g>
      <g id={`${id}-swan`}><path d="M-24 11Q-17-5 6 0Q25 4 26 15Q18 29-4 27Q-24 27-24 11Z" fill="#fffff0" stroke="#617a87" strokeWidth="1.3"/><path d="M6 8C35-3 5-15 10-34C14-46 32-42 31-31L24-28C27-39 16-38 17-29C18-17 36-5 21 12" fill="#fffdf0" stroke="#617a87" strokeWidth="1.3"/><path d="M30-33L38-29L30-27Z" fill="#bda685"/><circle cx="27" cy="-35" r="1.2" fill="#182a34"/><path d="M-19 8Q-7-2 12 9Q0 20-15 20M-17 12Q-4 5 9 11M-14 17Q-1 12 7 13" fill="none" stroke="#8196a0" strokeWidth="1.2"/><path d="M5-3L12 4L19-4L22 3L12 11L3 5Z" fill="#80b4c1" stroke="#e5f2ed"/><path d="M11 8L5 24M15 9L21 25" stroke="#8bbac7" strokeWidth="3"/></g>
    </defs>
    <path d={arch} fill={`url(#${id}-wood)`} stroke={colors[1]} strokeWidth="5"/>
    <path d={inset} fill="none" stroke={colors[0]} strokeWidth="2" opacity=".8"/>
    <path d={arch} fill={`url(#${id}-grain)`}/>
    {kind === 'witch' && <>
      <path d="M34 114V99Q35 42 94 37V114ZM106 37Q165 42 166 99V114Z" fill={`url(#${id}-glass)`} stroke="#807787" strokeWidth="3"/>
      {[36,106].map(x=><g key={x}><path d={`M${x} 127h58v113h-58ZM${x+4} 132h50v102h-50ZM${x} 253h58v69h-58ZM${x+4} 258h50v58h-50Z`} fill="none" stroke="#1b1922" strokeWidth="4"/><path d={`M${x+2} 129h54v108h-54M${x+2} 255h54v64h-54`} fill="none" stroke="#77717f" strokeWidth="1"/></g>)}
      <path d="M100 29V342" stroke="#131822" strokeWidth="3"/>
      <path d="M134 59A18 18 0 1 0 151 84A16 16 0 0 1 134 59Z" fill="#d9bb92"/>
      {[0,1,2,3,4,5].map(i=><ellipse key={i} cx="100" cy="163" rx={49+i*.9} ry={60-i*.9} transform={`rotate(${i*14-35} 100 163)`} fill="none" stroke={i%2?'#584150':'#2f2833'} strokeWidth="2.6"/>)}
      {Array.from({length:18},(_,i)=>{const a=i/18*Math.PI*2;return <g key={i} transform={`translate(${100+Math.cos(a)*51} ${163+Math.sin(a)*60}) rotate(${i*20})`}><path d="M0 0L-8-13M-3-4L5-14M-5-7L-15-6" stroke="#302939" strokeWidth="1.4"/><ellipse cx="3" cy="-9" rx="3" ry="7" fill={i%2?'#705977':'#443c55'} transform="rotate(35)"/></g>})}
      <use href={`#${id}-raven`} transform="translate(99 99) scale(.67)"/>
      <use href={`#${id}-raven`} transform="translate(99 169) scale(.78)"/>
      <path d="M101 216Q70 194 65 214Q69 235 99 222Q124 239 137 216Q130 194 101 216Z" fill="#765275" stroke="#4c344f" strokeWidth="2"/>
      <path d="M96 220Q78 255 85 288L99 279L105 229Q111 267 108 302L122 291L114 219" fill="#694566" stroke="#976f8f"/>
      <circle cx="28" cy="240" r="6" fill={`url(#${id}-silver)`}/><path d="M28 245v29" stroke={`url(#${id}-silver)`} strokeWidth="5"/>
    </>}
    {kind === 'iron' && <>
      <path d="M38 251V102C38 18 162 18 162 102V251Z" fill={`url(#${id}-glass)`} stroke="#8c4867" strokeWidth="4"/>
      <path d="M42 247V102C42 25 158 25 158 102V247Z" fill="none" stroke="#f1c2d1" strokeWidth="1.7"/>
      <g stroke="#e8aec7" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M64 136V209M86 123V217M114 123V217M136 136V209"/>
        <path d="M100 55C77 28 55 63 79 71C93 74 93 53 80 57M100 55C123 28 145 63 121 71C107 74 107 53 120 57M100 55C102 78 67 81 54 101C30 140 86 154 94 123C101 95 57 95 65 120C69 132 85 124 79 117M100 55C98 78 133 81 146 101C170 140 114 154 106 123C99 95 143 95 135 120C131 132 115 124 121 117"/>
        <path d="M100 249C96 228 69 221 60 205C45 181 75 177 74 195M100 249C104 228 131 221 140 205C155 181 125 177 126 195M100 249C88 218 45 211 49 237C51 257 84 252 81 233C78 221 62 228 68 235M100 249C112 218 155 211 151 237C149 257 116 252 119 233C122 221 138 228 132 235"/>
      </g>
      {[64,86,114,136].map(x=><g key={x}>{[151,193].map(y=><g key={y}><path d={`M${x-4} ${y}h8M${x-3} ${y-3}h6M${x-3} ${y+3}h6`} stroke="#efc4d0" strokeWidth="2"/></g>)}</g>)}
      <path d="M36 267H164V327H36Z" fill="#b87594" stroke="#edb7c9" strokeWidth="3"/><path d="M42 273H158V321H42Z" fill="none" stroke="#8f506e" strokeWidth="2"/>
      <path d="M76 296Q100 281 124 296Q100 313 76 296ZM87 296Q100 289 113 296Q100 304 87 296Z" fill="none" stroke="#e4a3bf" strokeWidth="2"/>
      <circle cx="29" cy="186" r="6" fill={`url(#${id}-silver)`}/><circle cx="29" cy="198" r="2.8" fill="#efd8d3"/>
      {[110,238,315].map(y=><rect key={y} x="178" y={y} width="6" height="17" rx="2" fill="#a66282" stroke="#e5aac3"/>)}
    </>}
    {kind === 'swan' && <>
      <path d="M19 83V347M181 83V347" stroke="#edf5e9" strokeWidth="7"/>
      <path d="M20 83Q20 1 100 8Q180 1 180 83" stroke="#eff7ed" strokeWidth="8" fill="none"/>
      <path d="M100 31V344" stroke="#6795ab" strokeWidth="2"/>
      {[36,107].map((x,i)=><g key={x}>
        <path d={`M${x} 74h57v59h-57ZM${x} 271h57v54h-57Z`} fill="none" stroke="#e3f1ee" strokeWidth="2"/>
        {[14,29,44].map(dx=><g key={dx}>{[98,296].map(y=><path key={y} d={`M${x+dx} ${y-10}q-2 7-6 10q4 4 6 11q2-7 6-11q-4-3-6-10Z`} fill="#44616b" stroke="#eaf2e7" strokeWidth=".8"/>)}</g>)}
        <path d={`M${x+28} 140C${x+9} 162 ${x+21} 169 ${x+3} 189Q${x+15} 201 ${x+8} 225Q${x+5} 244 ${x+28} 261Q${x+51} 244 ${x+48} 225Q${x+41} 201 ${x+53} 189C${x+35} 169 ${x+47} 162 ${x+28} 140Z`} fill={`url(#${id}-glass)`} stroke="#eef5eb" strokeWidth="2"/>
        <use href={`#${id}-swan`} transform={`translate(${x+28} 211) scale(${i ? -.67 : .67} .67)`}/>
        <path d={`M${x+28} 152v22M${x+20} 163h16M${x+23} 157l10 12M${x+33} 157l-10 12`} stroke="#dbe0b3" strokeWidth=".9"/>
        <path d={`M${x+10} 242q9-12 18 0t18 0`} stroke="#d2e3e9" fill="none" strokeWidth="3"/>
      </g>)}
      <g fill="none" stroke="#f4f5e7" strokeWidth="1.8"><use href={`#${id}-curl`} transform="translate(52 69) scale(.5)"/><use href={`#${id}-curl`} transform="translate(148 69) scale(-.5 .5)"/></g>
      <path d="M92 190v35M108 190v35" stroke={`url(#${id}-silver)`} strokeWidth="4"/><circle cx="100" cy="319" r="4" fill="#f6f2de"/>
    </>}
    {kind === 'garden' && <>
      <path d="M34 164V101C34 20 166 20 166 101V164Z" fill={`url(#${id}-glass)`} stroke="#a0ad85" strokeWidth="3"/>
      <path d="M100 40V340M37 101H162M38 153L100 71L163 154" fill="none" stroke="#718a68" strokeWidth="5"/>
      {[37,107].map(x=><g key={x}><rect x={x} y="180" width="55" height="60" fill="#4e6b4c" stroke="#9daa84" strokeWidth="2"/><rect x={x+6} y="186" width="43" height="48" fill="none" stroke="#344e3e" strokeWidth="2"/><rect x={x} y="257" width="55" height="66" fill="#4e6b4c" stroke="#9daa84" strokeWidth="2"/><rect x={x+6} y="263" width="43" height="54" fill="none" stroke="#344e3e" strokeWidth="2"/></g>)}
      <circle cx="91" cy="170" r="4" fill={`url(#${id}-silver)`}/>
      <path d="M9 343Q34 267 11 210T21 91Q25 4 99 11Q174 0 184 91T184 218Q170 286 191 344" fill="none" stroke="#34513a" strokeWidth="6"/>
      {Array.from({length:28},(_,i)=>{const side=i%2;const n=Math.floor(i/2);const y=335-n*24;const x=side?182+Math.sin(n)*8:18+Math.sin(n)*8;return <g key={i} transform={`translate(${x} ${y}) rotate(${side?-25:25})`}><path d="M0 0Q-26-3-19-20Q-3-22 0 0Q5-24 22-15Q19-1 0 0Z" fill={i%3?'#53724e':'#83915f'} stroke="#334d39" strokeWidth=".7"/></g>})}
      {[[-2,135,.7],[18,83,.9],[46,37,.85],[78,15,.7],[112,12,.9],[146,35,.8],[177,68,.9],[191,114,.7],[13,184,.75],[186,218,.9],[10,263,.8],[189,286,.7]].map(([x,y,s],i)=><Rose key={i} x={x} y={y} size={s} shade={i%3?'#f1d3d1':'#f9ecce'}/>)}
    </>}
    <path d="M17 346H183V351H17Z" fill={colors[1]}/>
  </svg>
}

export function KeyArtwork({ kind }: { kind: DoorId }) {
  const id = useId().replace(/:/g, '')
  return <svg viewBox="0 0 110 160" aria-hidden="true" focusable="false">
    <defs><linearGradient id={`${id}-key`}><stop stopColor="#182d2a" stopOpacity=".35"/><stop offset=".38" stopColor="#fff9e8" stopOpacity=".6"/><stop offset=".58" stopColor="#fff9e8" stopOpacity=".05"/><stop offset="1" stopColor="#182d2a" stopOpacity=".25"/></linearGradient></defs>
    <g fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinejoin="round" strokeLinecap="round">
      {kind === 'witch' ? <><ellipse cx="55" cy="33" rx="28" ry="28"/><path d="M55 8V54M38 40Q55 21 72 40M49 53H61"/></>
        : kind === 'iron' ? <><path d="M55 61C-6 61 17 12 39 30C54 44 29 53 32 35M55 61C116 61 93 12 71 30C56 44 81 53 78 35M55 44C30 25 47 10 55 6C63 10 80 25 55 44Z"/><circle cx="55" cy="5" r="2"/></>
        : kind === 'swan' ? <><path d="M55 61C-4 62 17 12 39 30C53 41 28 50 31 36M55 61C114 62 93 12 71 30C57 41 82 50 79 36M36 24Q51 16 55 1Q59 16 74 24"/><path d="M40 20Q28 22 31 12M70 20Q82 22 79 12"/></>
        : <><path d="M55 55C12 57 12 17 55 17C98 17 98 57 55 55Z"/><path d="M55 42L66 53L55 63L44 53Z"/></>}
    </g>
    <g fill="currentColor"><path d="M49 58H61V150H49Z"/><rect x="44" y="61" width="22" height="6" rx="2"/><rect x="45" y="71" width="20" height="5" rx="2"/>
      {kind==='swan'?<path d="M60 112H86V120H73V126H82V133H71V141H86V151H60Z"/>:<path d="M60 112H85V126H77V133H85V151H60V142H67V133H60Z"/>}
    </g>
    <path d="M49 76H61V112H85V126H77V133H85V151H49Z" fill={`url(#${id}-key)`}/>
    <path d="M52 80V145M46 64H62M47 73H62" stroke="#fffbe9" strokeOpacity=".48" strokeWidth="1.3"/>
  </svg>
}
