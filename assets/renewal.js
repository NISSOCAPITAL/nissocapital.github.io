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

  var QR = { 'code=LFYSTVYJ': 'doc', 'is=9qKmqWUTje': 'consult', 'group_id=203433': 'seminar', 'group_id=203431': 'seminar-online' };
  var qrFor = function (href) { for (var k in QR) { if (href.indexOf(k) !== -1) return '/assets/qr/' + QR[k] + '.svg'; } return null; };
  var isPC = window.matchMedia('(hover: hover) and (pointer: fine)');
  var dlg;
  var openQR = function (a, src) {
    if (!dlg) {
      dlg = document.createElement('dialog');
      dlg.className = 'qr-dlg';
      dlg.setAttribute('aria-labelledby', 'qr-dlg-title');
      dlg.innerHTML = '<button type="button" class="qr-dlg__close" aria-label="閉じる">×</button>' +
        '<p class="qr-dlg__label">LINE</p><h2 id="qr-dlg-title" class="qr-dlg__title"></h2>' +
        '<img class="qr-dlg__img" alt="" width="240" height="240">' +
        '<p class="qr-dlg__text">スマートフォンのカメラかLINEアプリで<br>QRコードを読み取ると、LINEで開きます。</p>';
      document.body.appendChild(dlg);
      dlg.querySelector('.qr-dlg__close').addEventListener('click', function () { dlg.close(); });
      dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    }
    dlg.querySelector('.qr-dlg__title').textContent = (a.textContent || '').replace(/^\s*GUIDEBOOK/, '').trim();
    var img = dlg.querySelector('.qr-dlg__img');
    img.src = src; img.alt = dlg.querySelector('.qr-dlg__title').textContent + 'のQRコード';
    if (dlg.showModal) dlg.showModal(); else window.open(a.href, '_blank', 'noopener');
  };
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="https://liff.line.me/"]');
    if (!a || !isPC.matches || e.ctrlKey || e.metaKey || e.shiftKey) return;
    var src = qrFor(a.href);
    if (!src) return;
    e.preventDefault();
    openQR(a, src);
  });
  var groups = [['.steps', '.step'], ['.svc-rows', '.svc-row'], ['.band', '.band__photo']];
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
