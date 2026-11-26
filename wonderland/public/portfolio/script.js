/* =========================================================
   个人作品集 · 交互脚本
   纯原生 JS，无依赖
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var header = document.getElementById('header');
  var nav = document.getElementById('nav');
  var menuBtn = document.getElementById('menuBtn');
  var themeBtn = document.getElementById('themeBtn');

  /* ---------- 1. 主题切换（记忆用户选择） ---------- */
  function applyTheme(theme) {
    root.dataset.theme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      /* 隐私模式下 localStorage 可能不可用，忽略即可 */
    }
    themeBtn.setAttribute(
      'aria-label',
      theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'
    );
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
    });
  }

  /* ---------- 2. 移动端菜单 ---------- */
  function closeMenu() {
    nav.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', '打开菜单');
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    });

    // 点击导航项后收起菜单
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });

    // 点击页面其他区域 / 按 Esc 也收起
    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(e.target) || menuBtn.contains(e.target)) return;
      closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- 3. 顶栏滚动状态 ---------- */
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 4. 滚动揭示 ---------- */
  var items = document.querySelectorAll('.reveal');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(function (el) {
      el.classList.add('is-visible');
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target); // 只播放一次
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    items.forEach(function (el, i) {
      // 同组元素轻微错峰，看起来更顺
      el.style.transitionDelay = Math.min(i % 4, 3) * 60 + 'ms';
      io.observe(el);
    });
  }

  /* ---------- 5. 页脚年份 ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
