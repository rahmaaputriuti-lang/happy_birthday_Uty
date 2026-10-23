/* ============================================================
   cake.js — Kue ulang tahun & tiup lilin (3D) MENGGAMBANG
   Muncul melayang di awal halaman 2, tanpa kartu & tanpa latar.
   Tiup dengan cara ketuk di mana aja (satu ketukan = satu lilin
   padam, lengkap dengan asap naik). Waktu semua lilin padam →
   konfeti + kembang api, lalu kue terangkat hilang.
   ============================================================ */
(function () {
    'use strict';

    var overlay = document.getElementById('cake-overlay');
    if (!overlay) return;

    var candlesEl = document.getElementById('candles');
    var cakeEl = document.getElementById('cake');
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var TOTAL = 3;
    var STRIPES = ['#ff5f9e', '#c084fc', '#ffb27a'];
    var SPRINKLE_COLORS = ['#ff5f9e', '#c084fc', '#ffd54a', '#4fc3f7', '#66bb6a', '#ff8a65'];

    var lit = 0;
    var opened = false;
    var blown = false;
    var closed = false;
    var cooldown = 0;

    /* ---------- bangun 3 lilin 3D ---------- */
    function buildCandles() {
        for (var i = 0; i < TOTAL; i++) {
            var c = document.createElement('div');
            c.className = 'candle lit';
            c.innerHTML =
                '<span class="flame">' +
                    '<svg viewBox="0 0 24 34" aria-hidden="true">' +
                        '<path class="f-outer" d="M12 2 C12 11 20 15 20 24 A8 8 0 0 1 4 24 C4 15 12 11 12 2Z"/>' +
                        '<path class="f-inner" d="M12 16 C12 21 16 23 16 27 A4 4 0 0 1 8 27 C8 23 12 21 12 16Z"/>' +
                    '</svg>' +
                '</span>' +
                '<span class="wick"></span>' +
                '<span class="candle-body"></span>' +
                '<span class="smoke"></span>';
            c.querySelector('.candle-body').style.setProperty('--stripe', STRIPES[i]);
            candlesEl.appendChild(c);
        }
        lit = TOTAL;
    }

    /* ---------- taburan warna di frosting ---------- */
    function buildSprinkles() {
        var icings = document.querySelectorAll('.cake-tier .icing');
        for (var t = 0; t < icings.length; t++) {
            for (var i = 0; i < 9; i++) {
                var s = document.createElement('span');
                s.className = 'sprinkle';
                s.style.left = (7 + Math.random() * 84).toFixed(1) + '%';
                s.style.top = (14 + Math.random() * 52).toFixed(1) + '%';
                s.style.background = SPRINKLE_COLORS[(Math.random() * SPRINKLE_COLORS.length) | 0];
                s.style.transform = 'rotate(' + (Math.random() * 150 - 75).toFixed(0) + 'deg)';
                icings[t].appendChild(s);
            }
        }
    }

    /* ---------- asap: gumpalan naik, mengembang, lalu hilang ---------- */
    function spawnSmoke(candle) {
        var smoke = candle.querySelector('.smoke');
        if (!smoke) return;
        smoke.innerHTML = '';
        for (var i = 0; i < 7; i++) {
            var p = document.createElement('i');
            p.className = 'puff';
            var size = (7 + Math.random() * 6);
            p.style.width = size.toFixed(1) + 'px';
            p.style.height = size.toFixed(1) + 'px';
            p.style.marginLeft = (-size / 2).toFixed(1) + 'px';
            p.style.setProperty('--dx', (Math.random() * 26 - 13).toFixed(1) + 'px');
            p.style.setProperty('--rise', (-(58 + Math.random() * 40)).toFixed(0) + 'px');
            p.style.setProperty('--delay', (i * 0.17 + Math.random() * 0.12).toFixed(2) + 's');
            p.style.setProperty('--dur', (2.2 + Math.random() * 1.2).toFixed(2) + 's');
            smoke.appendChild(p);
        }
        setTimeout(function () { if (smoke) smoke.innerHTML = ''; }, 5200);
    }

    /* ---------- padamkan satu lilin ---------- */
    function trigger() {
        var now = Date.now();
        if (!opened || blown || closed || now < cooldown) return;
        var next = candlesEl.querySelector('.candle.lit');
        if (!next) return;
        cooldown = now + 430;
        next.classList.remove('lit');
        next.classList.add('out');
        spawnSmoke(next);
        lit--;
        if (lit <= 0) allOut();
    }

    function allOut() {
        blown = true;
        overlay.classList.add('is-blown');

        var r = cakeEl.getBoundingClientRect();
        var cx = r.left + r.width / 2;
        var cy = r.top + r.height * 0.18;
        FX.burst(cx, cy, { count: 70, speed: 13, emojiCount: 6 });
        FX.heartFloat(cx, cy - 20, { count: 14 });
        if (!reduced) FX.celebrate({ waves: 2, fireworkSeconds: 4 });

        setTimeout(closePopup, 1600);
    }

    /* ---------- buka / tutup ---------- */
    function openPopup() {
        if (opened || closed) return;
        opened = true;
        overlay.classList.add('is-open');
    }

    function closePopup() {
        if (closed) return;
        closed = true;
        blown = true;
        overlay.classList.remove('is-open');
        overlay.classList.add('is-closing');
        document.body.classList.remove('cake-lock');
        setTimeout(function () {
            overlay.classList.remove('is-closing');
            overlay.setAttribute('aria-hidden', 'true');
        }, 680);
        try { document.dispatchEvent(new CustomEvent('cake:done')); } catch (e) {}
    }

    /* ---------- ketuk di mana aja (selama kue mengambang) ---------- */
    document.addEventListener('pointerdown', function (e) {
        if (!opened || blown || closed) return;
        if (e.target.closest && e.target.closest('a, button')) return;
        trigger();
    });

    /* ---------- init ---------- */
    buildCandles();
    buildSprinkles();
    document.body.classList.add('cake-lock');   // kunci scroll selama kue melayang

    function tryOpen() { setTimeout(openPopup, 250); }
    if (document.readyState === 'complete') tryOpen();
    else window.addEventListener('load', tryOpen);
})();
