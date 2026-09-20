(() => {
  const base='../assets/portfolio/please-lie-here/';
  const fine=matchMedia('(hover:hover) and (pointer:fine)');
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const image=document.querySelector('#material-image');
  const name=document.querySelector('#material-name');
  const status=document.querySelector('#material-status');
  const buttons=[...document.querySelectorAll('[data-material]')];
  let selected=buttons[0],request=0;
  async function show(button){
    const token=++request,next=new Image();next.src=base+button.dataset.material+'.webp';
    try{await next.decode()}catch{if(token===request)status.textContent='图像暂时无法加载，请重试。';return}
    if(token!==request)return;
    image.src=next.src;image.alt=button.textContent+' 材质研究';name.textContent=button.textContent;
    status.textContent=button===selected?'已选定 / SELECTED':'预览 / PREVIEW';
    if(!reduced.matches)image.animate([{opacity:.5},{opacity:1}],{duration:200});
  }
  buttons.forEach(button=>{
    button.addEventListener('click',()=>{selected=button;buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===selected)));show(button)});
    button.addEventListener('pointerenter',()=>{if(fine.matches)show(button)});
    button.addEventListener('focus',()=>show(button));
  });
  const options=document.querySelector('.material-options');
  options.addEventListener('pointerleave',()=>show(selected));
  options.addEventListener('focusout',e=>{if(!options.contains(e.relatedTarget))show(selected)});
  if(!reduced.matches&&'IntersectionObserver' in window){document.documentElement.classList.add('motion-ready');const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}
})();
