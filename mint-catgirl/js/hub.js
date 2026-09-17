const xiaohongshuUrl = 'https://xhslink.com/m/q2RPOCCRho';
const taobaoUrl = 'https://e.tb.cn/h.8suWwxXoqqxGGwu?tk=s87xT8mnIJD';
document.querySelectorAll('.hub-footer,.sub-footer').forEach(footer=>{const about=document.createElement('a');about.href='about.html';about.className='about-link';about.textContent='关于作者';about.style.cssText='margin-left:14px;color:#a8ffd8;text-decoration:underline';footer.append(about)});

const storeLinkStyle = document.createElement('style');
storeLinkStyle.textContent = '.store-links{display:flex;align-items:center;gap:12px}.taobao-link{display:inline-flex;align-items:center;padding:12px 17px;border:1px solid rgba(13,31,26,.22);border-radius:18px;background:rgba(232,255,246,.6);box-shadow:0 0 22px rgba(79,209,165,.17);color:#0D1F1A;font-size:14px;transition:transform .2s,background .2s,border-color .2s}.taobao-link:hover{transform:translateY(-2px);background:rgba(255,245,248,.8);border-color:#FFB3C6}.taobao-link:active{transform:scale(.92)}@media(max-width:760px){.store-links{gap:8px}.store-links .store-button,.taobao-link{padding:10px 12px;font-size:12px}}';
document.head.append(storeLinkStyle);

document.querySelectorAll('.store-button').forEach(button => {
  button.addEventListener('click', () => {
    window.location.assign(xiaohongshuUrl);
  });

  const taobaoLink = document.createElement('a');
  taobaoLink.className = 'taobao-link';
  taobaoLink.href = taobaoUrl;
  taobaoLink.target = '_blank';
  taobaoLink.rel = 'noopener noreferrer';
  taobaoLink.textContent = '前往淘宝店铺 ↗';
  const group = document.createElement('div');
  group.className = 'store-links';
  button.parentElement.insertBefore(group, button);
  group.append(button, taobaoLink);
});
