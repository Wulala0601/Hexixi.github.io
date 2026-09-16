(() => {
  if (matchMedia('(pointer: coarse)').matches) return;
  const cursor = document.createElement('div'); cursor.className = 'custom-cursor'; cursor.innerHTML = '✦'; document.body.append(cursor);
  addEventListener('mousemove', e => { cursor.style.transform = `translate(${e.clientX - 12}px,${e.clientY - 12}px)`; });
  document.querySelectorAll('a,button').forEach(el => { el.addEventListener('mouseenter', () => cursor.classList.add('is-active')); el.addEventListener('mouseleave', () => cursor.classList.remove('is-active')); });
})();
