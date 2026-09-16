const back=document.createElement('a');back.className='music-back';back.href='index.html';back.textContent='← 回到主页';document.body.prepend(back);
const lyricsWindow=document.querySelector('.lyrics-window');document.querySelector('.player').after(lyricsWindow);
const audio=document.querySelector('#audio'),card=document.querySelector('.player'),play=document.querySelector('#play'),cover=document.querySelector('#cover'),bar=document.querySelector('#progress'),vol=document.querySelector('#volume'),now=document.querySelector('#now'),all=document.querySelector('#all'),status=document.querySelector('#status'),count=document.querySelector('#count'),mode=document.querySelector('#mode');
const format=t=>String(Math.floor(t/60)||0).padStart(2,'0')+':'+String(Math.floor(t%60)||0).padStart(2,'0');
audio.volume=.7;let counted=false,modeIndex=0;
count.textContent=Number(localStorage.getItem('catgirl-plays')||12847).toLocaleString();
function toggle(){audio.paused?audio.play().catch(()=>status.textContent='音频加载失败：请使用本地服务器预览'):audio.pause()}
play.onclick=toggle;cover.onclick=toggle;
audio.onplay=()=>{card.classList.add('playing');play.textContent='❚❚';status.textContent='正在播放';if(!counted){const n=Number(localStorage.getItem('catgirl-plays')||12847)+1;localStorage.setItem('catgirl-plays',n);count.textContent=n.toLocaleString();counted=true}};
audio.onpause=()=>{card.classList.remove('playing');play.textContent='▶';if(!audio.ended)status.textContent='已暂停'};
audio.onloadedmetadata=()=>all.textContent=format(audio.duration);
audio.ontimeupdate=()=>{now.textContent=format(audio.currentTime);bar.value=audio.duration?audio.currentTime/audio.duration*100:0;updateLyrics(audio.currentTime)};
bar.oninput=()=>{if(audio.duration){audio.currentTime=bar.value*audio.duration/100;updateLyrics(audio.currentTime)}};
vol.oninput=()=>audio.volume=vol.value/100;
mode.onclick=()=>{modeIndex=(modeIndex+1)%3;const option=[['↻','单曲循环'],['☷','列表循环'],['⤨','随机']][modeIndex];audio.loop=modeIndex===0;mode.textContent=option[0]+' '+option[1]};

// Lyrics module: timing values are arranged for the ~2 minute theme track.
const lyrics=[
[0,'(Neon lights... booting up...)'],[3.5,'Who am I? Who am I? キラキラの宇宙'],[7.5,'Who am I? Who am I? 闪闪发光的宇宙'],[11,'Let\'s go!'],[14,'銀色の銃をポケットにしまって (しまって)'],[18,'今日も出かける 宇宙のどこかへ'],[22,'わるいやつらは 感化ビームで'],[26,'みんな仲良し 平和が一番 (peace!)'],[30,'だけど夜になると 考えてしまう (しまう)'],[34,'わたしの記憶は 誰のもの? (誰の?)'],[38,'クローンだらけの 銀河の中で'],[42,'キミと出会って わかったこと (わかった!)'],[46,'わたしがわたしを 選ぶ限り'],[50,'オリジナルは どこにもいらない'],[54,'Who am I? Who am I? (Catgirl!)'],[58,'コピーでも 本物でも (どっちでも!)'],[62,'ポケットには 夢と銃'],[66,'魂の形は 誰にも見えない (Yeah!)'],[70,'Who am I? Who am I? (Catgirl!)'],[74,'今日もどこかで ミラクルショッピング'],[78,'バグってる世界 だけど'],[82,'わたしは わたしを 生きてく (Stay!)'],[86,'実験体だった 過去もあるけど (あるけど)'],[90,'痛みの記憶も わたしの一部'],[94,'深緑の髪 なびかせて'],[98,'銀河のダンスフロア 踊り明かそう'],[102,'完璧じゃなくて いいじゃん (いいじゃん!)'],[106,'キミがキミなら それでいいじゃん (いいじゃん!)'],[110,'Maybe I\'m just a copy / Maybe I\'m the real one'],[114,'I\'m here, I\'m alive, I\'m having fun!'],[117,'Who am I? Who am I? (Catgirl!)'],[119,'わたしは わたしを 生きてく (Stay!)']];
const lyricTrack=document.querySelector('#lyrics-track');let lyricNodes=[],active=-1;
lyrics.forEach(([time,text],index)=>{const line=document.createElement('p');line.className='lyric-line';line.textContent=text;line.onclick=()=>{audio.currentTime=time;updateLyrics(time);if(audio.paused)audio.play().catch(()=>{})};lyricTrack.append(line);lyricNodes.push(line)});
function updateLyrics(time){let index=0;for(let i=0;i<lyrics.length;i++){if(time>=lyrics[i][0])index=i;else break}if(index===active)return;active=index;lyricNodes.forEach((line,i)=>{line.classList.toggle('current',i===index);line.classList.toggle('past',i<index)});const target=lyricNodes[index];lyricTrack.style.transform='translateY('+(136-target.offsetTop-target.offsetHeight/2)+'px)'}
updateLyrics(0);
