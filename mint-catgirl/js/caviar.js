(() => {
  const base = window.resolveMediaUrl ? (window.resolveMediaUrl('../assets/portfolio/caviar/')) : '../assets/portfolio/caviar/';
  const resolveVideo = (src) => {
    if (!src) return src;
    if (/^https?:\/\//i.test(src) || /^data:/i.test(src) || /^blob:/i.test(src)) return src;
    const path = src.includes('/') ? src : `../assets/portfolio/caviar/${src}`;
    return window.resolveMediaUrl ? window.resolveMediaUrl(path) : path;
  };

  const finalFilm = document.querySelector('#final-film');
  const finalSource = finalFilm && finalFilm.querySelector('source');
  if (finalSource) {
    finalSource.src = resolveVideo('../assets/portfolio/caviar/final-film.mp4');
    finalFilm.load();
  }

  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = preference.matches;
  const motion = document.querySelector('.motion-control');
  const videos = [...document.querySelectorAll('video[data-src]')];
  const visibility = new Map();

  function update(video) {
    if (paused || !visibility.get(video) || document.hidden) {
      video.pause();
      return;
    }
    if (!video.getAttribute('src')) {
      const target = resolveVideo(video.dataset.src);
      if (target) video.src = target;
    }
    video.play().catch(() => {});
  }

  function sync() {
    if (motion) {
      motion.textContent = paused ? '播放动态' : '暂停动态';
      motion.setAttribute('aria-pressed', String(paused));
    }
    videos.forEach(update);
  }

  if (motion) {
    motion.addEventListener('click', () => { paused = !paused; sync(); });
  }
  preference.addEventListener('change', () => { paused = preference.matches; sync(); });
  document.addEventListener('visibilitychange', () => videos.forEach(update));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(e => {
      visibility.set(e.target, e.isIntersecting);
      update(e.target);
    }), { threshold: .15 });
    videos.forEach(v => observer.observe(v));
  } else {
    videos.forEach(v => visibility.set(v, true));
  }

  const characters = [
    { file: 'dancer', name: 'Phantom Ball Lead Dancer', description: '月光亮起，幽灵入席。鱼子酱换上舞裙，成为暗夜舞会的领舞者。', number: 'I' },
    { file: 'witch', name: 'Pumpkin’s Little Witch', description: '骑上扫帚，在南瓜与古堡之间穿行。小女巫让万圣夜多了一点顽皮的魔法。', number: 'II' },
    { file: 'apprentice', name: 'Potion Apprentice', description: '翻开魔法书，让彩色气泡从坩埚升起。学徒的好奇心，酿成了奇幻夜的新故事。', number: 'III' }
  ];

  const video = document.querySelector('#character-video');
  let request = 0;
  document.querySelectorAll('[data-character]').forEach(button => button.addEventListener('click', async () => {
    const item = characters[Number(button.dataset.character)];
    const token = ++request;
    const status = document.querySelector('#character-status');
    if (status) status.textContent = '';

    const poster = new Image();
    poster.src = resolveVideo(`../assets/portfolio/caviar/${item.file}.jpg`);
    try {
      await poster.decode();
    } catch {
      if (token === request && status) status.textContent = '图像暂时无法加载，请重试。';
      return;
    }

    if (token !== request) return;
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.poster = poster.src;
      video.dataset.src = `${item.file}.mp4`;
      video.load();
      video.setAttribute('aria-label', item.name + ' 动态角色');
    }

    const name = document.querySelector('#character-name');
    const description = document.querySelector('#character-description');
    const index = document.querySelector('#character-index');
    if (name) name.textContent = item.name;
    if (description) description.textContent = item.description;
    if (index) index.textContent = item.number;

    document.querySelectorAll('[data-character]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    update(video);
  }));

  if (video) {
    video.addEventListener('error', () => {
      const status = document.querySelector('#character-status');
      if (status) status.textContent = '动态暂时无法加载，已保留角色静态图。';
    });
  }

  sync();
})();
