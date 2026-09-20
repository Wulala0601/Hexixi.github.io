(() => {
  const base='../assets/portfolio/caviar/';
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  let paused=preference.matches;
  const motion=document.querySelector('.motion-control');
  const videos=[...document.querySelectorAll('video[data-src]')];
  const visibility=new Map();
  function update(video){
    if(paused||!visibility.get(video)||document.hidden){video.pause();return;}
    if(!video.getAttribute('src'))video.src=base+video.dataset.src;
    video.play().catch(()=>{});
  }
  function sync(){motion.textContent=paused?'播放动态':'暂停动态';motion.setAttribute('aria-pressed',String(paused));videos.forEach(update);}
  motion.addEventListener('click',()=>{paused=!paused;sync()});
  preference.addEventListener('change',()=>{paused=preference.matches;sync()});
  document.addEventListener('visibilitychange',()=>videos.forEach(update));
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{visibility.set(e.target,e.isIntersecting);update(e.target)}),{threshold:.15});videos.forEach(v=>observer.observe(v));}
  else videos.forEach(v=>visibility.set(v,true));
  const characters=[
    {file:'dancer',name:'Phantom Ball Lead Dancer',description:'月光亮起，幽灵入席。鱼子酱换上舞裙，成为暗夜舞会的领舞者。',number:'I'},
    {file:'witch',name:"Pumpkin’s Little Witch",description:'骑上扫帚，在南瓜与古堡之间穿行。小女巫让万圣夜多了一点顽皮的魔法。',number:'II'},
    {file:'apprentice',name:'Potion Apprentice',description:'翻开魔法书，让彩色气泡从坩埚升起。学徒的好奇心，酿成了奇幻夜的新故事。',number:'III'}
  ];
  const video=document.querySelector('#character-video');let request=0;
  document.querySelectorAll('[data-character]').forEach(button=>button.addEventListener('click',async()=>{
    const item=characters[Number(button.dataset.character)],token=++request;
    const status=document.querySelector('#character-status');status.textContent='';
    const poster=new Image();poster.src=base+item.file+'.jpg';
    try{await poster.decode()}catch{if(token===request)status.textContent='图像暂时无法加载，请重试。';return}
    if(token!==request)return;
    video.pause();video.removeAttribute('src');video.poster=poster.src;video.dataset.src=item.file+'.mp4';video.load();
    video.setAttribute('aria-label',item.name+' 动态角色');
    document.querySelector('#character-name').textContent=item.name;
    document.querySelector('#character-description').textContent=item.description;
    document.querySelector('#character-index').textContent=item.number;
    document.querySelectorAll('[data-character]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    update(video);
  }));
  video.addEventListener('error',()=>{document.querySelector('#character-status').textContent='动态暂时无法加载，已保留角色静态图。'});
  sync();
})();
