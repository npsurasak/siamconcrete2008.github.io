// Lightbox ขยายรูป — ทำงานกับทุกองค์ประกอบที่มี data-lightbox รวมถึงรูปที่ JS เพิ่มทีหลัง
(function () {
  var box = null;
  var img = null;
  function ensureBox() {
    if (box) return;
    box = document.createElement('div');
    box.className = 'lightbox';
    box.innerHTML = '<button class="lightbox-close" aria-label="ปิด" type="button">×</button><img alt="">';
    document.body.appendChild(box);
    img = box.querySelector('img');
    box.addEventListener('click', closeBox);
  }
  function closeBox() {
    if (!box) return;
    box.classList.remove('open');
    img.removeAttribute('src');
    document.body.style.overflow = '';
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-lightbox]') : null;
    if (!el) return;
    e.preventDefault();
    ensureBox();
    img.src = el.getAttribute('data-lightbox');
    img.alt = el.getAttribute('data-alt') || '';
    box.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeBox(); });
})();

// แกลเลอรีอัตโนมัติ: ตรวจหารูปชื่อ <prefix>-1.jpg ... <prefix>-N.jpg ที่มีอยู่จริงแล้วแสดงเอง
// วิธีเพิ่มรูป: อัปโหลดไฟล์ชื่อตามกติกาเข้าโฟลเดอร์ img (ดู img/README.md) — ไม่ต้องแก้โค้ด
(function () {
  var galleries = document.querySelectorAll('.js-gallery[data-slot-prefix]');
  galleries.forEach(function (grid) {
    var prefix = grid.getAttribute('data-slot-prefix');
    var max = parseInt(grid.getAttribute('data-slot-max') || '12', 10);
    var altText = grid.getAttribute('data-slot-alt') || '';
    var slots = [];
    var found = 0;
    var done = 0;
    var finished = false;
    function finalize() {
      if (done < max || finished) return;
      finished = true;
      slots.forEach(function (el) { if (el) grid.appendChild(el); });
      if (found > 0) {
        var band = grid.querySelector('.ph-wide');
        if (band) band.style.display = 'none';
      }
    }
    for (var n = 1; n <= max; n++) {
      (function (i) {
        var src = prefix + '-' + i + '.jpg';
        var probe = new Image();
        probe.onload = function () {
          var el = document.createElement('img');
          el.className = 'gallery-img';
          el.src = src;
          el.alt = altText;
          el.loading = 'lazy';
          el.setAttribute('data-lightbox', src);
          el.setAttribute('data-alt', altText);
          slots[i - 1] = el;
          found = found + 1;
          done = done + 1;
          finalize();
        };
        probe.onerror = function () {
          done = done + 1;
          finalize();
        };
        probe.src = src;
      })(n);
    }
  });
})();

// เมนูมือถือ: เปิด/ปิดเมนูนำทาง
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // ปิดเมนูเมื่อคลิกลิงก์ (สำหรับลิงก์ anchor ภายในหน้า)
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();
