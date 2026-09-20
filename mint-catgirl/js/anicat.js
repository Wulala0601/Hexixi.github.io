(() => {
  const root = '../assets/portfolio/anicat/';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const skus = [
    {name:'Chicken Breast',image:'chicken-breast.webp',bg:'#e5eecf',colors:['#162675','#b7d93c','#ffffff']},
    {name:'Chicken Liver',image:'chicken-liver.webp',bg:'#efdce9',colors:['#dd2488','#241561','#ffffff']},
    {name:'Duck Breast',image:'duck-breast.webp',bg:'#dce7c5',colors:['#719b32','#e9e94f','#ffffff']}
  ];
  const packaging = document.querySelector('.packaging');
  const packImage = document.querySelector('#pack-image');
  let request = 0;
  document.querySelectorAll('[data-sku]').forEach(button => button.addEventListener('click', async () => {
    const token = ++request, sku = skus[Number(button.dataset.sku)];
    const next = new Image(); next.src = root + sku.image;
    try { await next.decode(); } catch { return; }
    if (token !== request) return;
    document.querySelectorAll('[data-sku]').forEach(b => b.setAttribute('aria-pressed',String(b === button)));
    packImage.src = next.src; packImage.alt = sku.name + ' 包装设计';
    document.querySelector('#pack-name').textContent = sku.name;
    packaging.style.setProperty('--pack-bg',sku.bg);
    sku.colors.forEach((color,i) => packaging.style.setProperty('--c'+(i+1),color));
    if (!reduced) packImage.animate([{opacity:.4,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:220});
  }));
  document.querySelectorAll('.character').forEach(character => {
    character.addEventListener('click',() => character.setAttribute('aria-expanded',String(character.getAttribute('aria-expanded') !== 'true')));
    character.addEventListener('pointermove',e => {
      if (!fine.matches || reduced) return;
      const r = character.getBoundingClientRect();
      character.style.setProperty('--x',((e.clientX-r.left)/r.width-.5)*10+'px');
      character.style.setProperty('--y',((e.clientY-r.top)/r.height-.5)*10+'px');
    });
    character.addEventListener('pointerleave',() => {character.style.setProperty('--x','0px');character.style.setProperty('--y','0px');});
  });
  const gallery = document.querySelector('.gallery');
  let drag;
  gallery.addEventListener('pointerdown',e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    drag={x:e.clientX,scroll:gallery.scrollLeft};gallery.setPointerCapture(e.pointerId);gallery.classList.add('dragging');
  });
  gallery.addEventListener('pointermove',e => {if(drag) gallery.scrollLeft=drag.scroll+drag.x-e.clientX;});
  ['pointerup','pointercancel','lostpointercapture'].forEach(type => gallery.addEventListener(type,() => {drag=null;gallery.classList.remove('dragging');}));
  gallery.addEventListener('keydown',e => {if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();gallery.scrollBy({left:(e.key==='ArrowRight'?1:-1)*300,behavior:reduced?'instant':'smooth'});}});
  const stickers = [...document.querySelectorAll('.sticker')];
  stickers.forEach(sticker => {
    let active, x=0, y=0;
    const move = (nx,ny) => {const area=sticker.parentElement;x=Math.max(-sticker.offsetLeft,Math.min(nx,area.clientWidth-sticker.offsetLeft-sticker.offsetWidth));y=Math.max(-sticker.offsetTop,Math.min(ny,area.clientHeight-sticker.offsetTop-sticker.offsetHeight));sticker.style.setProperty('--dx',x+'px');sticker.style.setProperty('--dy',y+'px');};
    sticker.addEventListener('pointerdown',e => {if(!fine.matches||e.pointerType!=='mouse'||e.button!==0)return;active={px:e.clientX,py:e.clientY,x,y};sticker.setPointerCapture(e.pointerId);});
    sticker.addEventListener('pointermove',e => {if(active)move(active.x+e.clientX-active.px,active.y+e.clientY-active.py);});
    ['pointerup','pointercancel','lostpointercapture'].forEach(type => sticker.addEventListener(type,()=>active=null));
    sticker.addEventListener('keydown',e => {const delta={ArrowLeft:[-12,0],ArrowRight:[12,0],ArrowUp:[0,-12],ArrowDown:[0,12]}[e.key];if(delta){e.preventDefault();move(x+delta[0],y+delta[1]);}});
    sticker.addEventListener('click',() => {if(!fine.matches&&!reduced)sticker.animate([{scale:'1'},{scale:'1.1'},{scale:'1'}],{duration:260});});
    document.querySelector('#reset-stickers').addEventListener('click',()=>move(0,0));
  });
  if (!reduced && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});
    document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  }
})();
