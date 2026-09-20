(() => {
  const memories={
    pillow:{title:'白枕头',text:'长久的陪伴，会把一件普通物品变成一处熟悉的地方。阿贝贝，是关于依恋的起点。'},
    telephone:{title:'玩具电话',text:'曾经相信，一通电话可以穿过时间和空间，把想念送到另一边。'},
    toy:{title:'安静的陪伴',text:'玩具不需要回答。它只是在那里，陪伴那些独自长大的时刻。'},
    fireworks:{title:'一瞬间的光',text:'烟火亮起，又慢慢消失。记忆留下的，有时只是那一瞬间的光。'}
  };
  const dialog=document.querySelector('#memory-dialog');
  let opener=null,request=0,previousOverflow='';
  document.querySelectorAll('[data-memory]').forEach(button=>button.addEventListener('click',async()=>{
    const token=++request,key=button.dataset.memory,item=memories[key],image=new Image();
    image.src='../assets/portfolio/undone/'+key+'.webp';
    try{await image.decode()}catch{return}
    if(token!==request)return;
    opener=button;
    document.querySelector('#memory-image').src=image.src;
    document.querySelector('#memory-image').alt=item.title+'的记忆意象';
    document.querySelector('#memory-title').textContent=item.title;
    document.querySelector('#memory-text').textContent=item.text;
    previousOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    dialog.showModal();
  }));
  document.querySelector('.close-memory').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('keydown',e=>{
    if(e.key==='Tab'){
      e.preventDefault();
      dialog.querySelector('.close-memory').focus();
    }
  });
  dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()});
  dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;opener?.focus({preventScroll:true})});
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  if(!reduced.matches&&'IntersectionObserver' in window){document.documentElement.classList.add('motion-ready');const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}
})();
