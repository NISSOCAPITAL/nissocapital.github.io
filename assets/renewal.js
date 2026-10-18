(function () {
  var header = document.querySelector('.site-header');
  var btn = header && header.querySelector('.nav-btn');
  if (btn) {
    var setOpen = function (open) {
      header.classList.toggle('nav-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    };
    btn.addEventListener('click', function () { setOpen(!header.classList.contains('nav-open')); });
    header.querySelector('.gnav').addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && header.classList.contains('nav-open')) { setOpen(false); btn.focus(); } });
  }

  var root = document.documentElement;
  var groups = [['.steps', '.step'], ['.svc-rows', '.svc-row']];
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    groups.forEach(function (g) {
      var box = document.querySelector(g[0]);
      if (!box) return;
      var items = box.querySelectorAll(g[1]);
      items.forEach(function (el, i) { el.style.setProperty('--i', i); });
      var io = new IntersectionObserver(function (entries) {
        if (!entries.some(function (e) { return e.isIntersecting; })) return;
        items.forEach(function (el) { el.classList.add('is-in'); });
        io.disconnect();
      }, { threshold: 0.2 });
      io.observe(box);
    });
    root.classList.add('reveal-ready');
  }

  var fv = document.getElementById('top');
  if (!fv || !root.classList.contains('rise-play')) return;

  try { sessionStorage.setItem('nissoRiseSeen', '1'); } catch (e) {}

  var svg = fv.querySelector('.rise-svg');
  var img = svg && svg.querySelector('.ph-in');
  var mq = window.matchMedia('(min-width: 1024px)');
  var frame = function () {
    if (!svg) return;
    if (mq.matches) {
      svg.setAttribute('viewBox', '0 197 941 1205');
      img.setAttribute('href', '/assets/rise-pc.jpg');
      img.setAttribute('y', '197'); img.setAttribute('height', '1205');
    } else {
      svg.setAttribute('viewBox', '0 0 941 1672');
      img.setAttribute('href', '/assets/rise-full.jpg');
      img.setAttribute('y', '0'); img.setAttribute('height', '1672');
    }
  };
  frame();

  var timer;
  var end = function () {
    clearTimeout(timer);
    root.classList.remove('rise-play');
    ['click', 'wheel', 'touchstart'].forEach(function (t) { fv.removeEventListener(t, end); });
    document.removeEventListener('keydown', onKey);
    if (mq.removeEventListener) mq.removeEventListener('change', end);
  };
  var onKey = function (e) { if (e.key === 'Escape') end(); };
  ['click', 'wheel', 'touchstart'].forEach(function (t) { fv.addEventListener(t, end, { passive: true }); });
  document.addEventListener('keydown', onKey);
  if (mq.addEventListener) mq.addEventListener('change', end);
  timer = setTimeout(end, 4100);
})();
