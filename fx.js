/* ============================================================
   fx.js — Mesin Efek Visual
   Konfeti, kembang api, hati melayang, jejak sparkle, emoji rain.
   Tanpa library tambahan, dipakai bersama oleh semua halaman.

   Catatan performa:
   - DPI dibatasi supaya canvas tidak kegedean di HP
   - Render berhenti otomatis kalau tab disembunyikan
   - Loop berhenti sendiri kalau tidak ada partikel
   ============================================================ */
(function () {
    'use strict';

    var canvas = document.createElement('canvas');
    canvas.className = 'fx-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    var isSmall = window.innerWidth < 768;
    // di HP cukup 1.5x — mata telanjang nggak ngeh bedanya, tapi beban GPU jauh lebih ringan
    var DPR = Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 2);
    var MAX_PARTS = isSmall ? 650 : 1000;

    var W = 0, H = 0;
    var dirty = false;          // apakah canvas masih ada isinya
    var running = false;
    var rafId = null;

    function resize() {
        isSmall = window.innerWidth < 768;
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = Math.round(W * DPR);
        canvas.height = Math.round(H * DPR);
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        dirty = true;
    }
    resize();

    var resizeTimer = null;
    window.addEventListener('resize', function () {
        // ditunda dulu biar nggak render ulang berkali-kali saat user geser layar
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 150);
    }, { passive: true });

    // ubah ukuran juga waktu orientasi berubah (beberapa HP Android nggak kena 'resize')
    window.addEventListener('orientationchange', function () {
        setTimeout(resize, 250);
    }, { passive: true });

    var COLORS = ['#ff5f9e', '#ff8fc7', '#c084fc', '#a78bfa', '#fbbf24',
        '#fda4af', '#67e8f9', '#ffffff', '#f9a8d4', '#f472b6'];
    var HEART_COLORS = ['#ff5f9e', '#ff8fc7', '#f472b6', '#a855f7', '#fb7185'];
    var SPARK_COLORS = ['#ffffff', '#ffd6ec', '#ffe9a8', '#e9d4ff'];
    var EMOJI = ['💖', '💗', '💕', '✨', '🌸', '💫', '⭐', '🩷', '🎈'];

    var parts = [];
    var rockets = [];
    var fwTimer = null;

    function rand(a, b) { return a + Math.random() * (b - a); }
    function pick(a) { return a[(Math.random() * a.length) | 0]; }
    function add(p) { if (parts.length < MAX_PARTS) parts.push(p); }

    /* ---------- gambar bentuk ---------- */
    function drawHeart(x, y, s, rot, color, alpha) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.62);
        ctx.bezierCurveTo(-s * 1.25, -s * 0.2, -s * 0.55, -s * 1.15, 0, -s * 0.42);
        ctx.bezierCurveTo(s * 0.55, -s * 1.15, s * 1.25, -s * 0.2, 0, s * 0.62);
        ctx.fill();
        ctx.restore();
    }

    /* ---------- ledakan konfeti ---------- */
    function burst(x, y, opts) {
        opts = opts || {};
        var count = opts.count || 70;
        var speed = opts.speed || 11;
        var spread = opts.spread === undefined ? Math.PI * 2 : opts.spread;
        var angle = opts.angle === undefined ? -Math.PI / 2 : opts.angle;
        var gravity = opts.gravity === undefined ? 0.3 : opts.gravity;
        var drag = opts.drag === undefined ? 0.985 : opts.drag;
        var baseDecay = opts.decay || 0.01;

        for (var i = 0; i < count; i++) {
            var a = angle + rand(-spread / 2, spread / 2);
            var sp = rand(1.5, speed);
            add({
                kind: Math.random() < 0.3 ? 'heart' : 'rect',
                x: x, y: y,
                vx: Math.cos(a) * sp,
                vy: Math.sin(a) * sp,
                w: rand(4, 9), h: rand(7, 15),
                s: rand(7, 14),
                color: pick(COLORS),
                rot: rand(0, 6.283),
                vr: rand(-0.3, 0.3),
                gravity: gravity, drag: drag,
                life: 1, decay: baseDecay * rand(0.7, 1.4)
            });
        }

        var ec = opts.emojiCount === undefined ? 5 : opts.emojiCount;
        for (var j = 0; j < ec; j++) {
            var a2 = angle + rand(-spread / 2, spread / 2);
            var sp2 = rand(2, speed * 0.8);
            add({
                kind: 'emoji', text: pick(EMOJI),
                x: x, y: y,
                vx: Math.cos(a2) * sp2,
                vy: Math.sin(a2) * sp2,
                s: rand(15, 27),
                rot: rand(-0.5, 0.5), vr: rand(-0.1, 0.1),
                gravity: gravity * 0.8, drag: drag,
                life: 1, decay: baseDecay * rand(0.7, 1.2)
            });
        }

        wake();
    }

    /* ---------- hati melayang ke atas ---------- */
    function heartFloat(x, y, opts) {
        opts = opts || {};
        var n = opts.count || 10;
        for (var i = 0; i < n; i++) {
            add({
                kind: 'heart',
                x: x + rand(-70, 70),
                y: y + rand(-30, 30),
                vx: rand(-1.4, 1.4),
                vy: rand(-7, -2.5),
                s: rand(9, 20),
                color: pick(HEART_COLORS),
                rot: rand(-0.6, 0.6), vr: rand(-0.08, 0.08),
                gravity: -0.015, drag: 0.992,
                life: 1, decay: rand(0.004, 0.009)
            });
        }
        wake();
    }

    /* ---------- jejak sparkle (dipakai untuk cursor) ---------- */
    function sparkle(x, y, n) {
        n = n || 3;
        for (var i = 0; i < n; i++) {
            add({
                kind: 'spark',
                x: x + rand(-7, 7), y: y + rand(-7, 7),
                vx: rand(-0.7, 0.7), vy: rand(-0.7, 0.7),
                s: rand(2, 5.5),
                color: pick(SPARK_COLORS),
                rot: 0, vr: 0,
                gravity: 0, drag: 0.95,
                life: 1, decay: rand(0.03, 0.065)
            });
        }
        wake();
    }

    /* ---------- kembang api ---------- */
    function firework(x, to) {
        rockets.push({
            x: x, y: H + 12, px: x, py: H + 12,
            vx: rand(-0.6, 0.6),
            vy: rand(-13.5, -10.5),
            to: to === undefined ? rand(H * 0.14, H * 0.45) : to,
            color: pick(COLORS)
        });
        wake();
    }

    function fireworks(seconds) {
        if (fwTimer) return;
        var end = Date.now() + (seconds || 6) * 1000;
        (function spawn() {
            if (Date.now() > end) { fwTimer = null; return; }
            firework(rand(W * 0.08, W * 0.92));
            fwTimer = setTimeout(spawn, rand(220, 520));
        })();
    }

    /* ---------- pesta total ---------- */
    function celebrate(opts) {
        opts = opts || {};
        var waves = opts.waves || 3;
        for (var i = 0; i < waves; i++) {
            (function (k) {
                setTimeout(function () {
                    burst(-12, H * rand(0.35, 0.65), { count: 45, angle: -0.45, spread: 1.1, speed: 14, emojiCount: 4 });
                    burst(W + 12, H * rand(0.35, 0.65), { count: 45, angle: Math.PI + 0.45, spread: 1.1, speed: 14, emojiCount: 4 });
                }, k * 450);
            })(i);
        }
        fireworks(opts.fireworkSeconds || 6);
    }

    /* ---------- pengatur loop ---------- */
    function wake() {
        if (!running && !document.hidden) {
            running = true;
            rafId = requestAnimationFrame(tick);
        }
    }

    function sleep() {
        running = false;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        if (fwTimer) { clearTimeout(fwTimer); fwTimer = null; }
    }

    // hemat baterai: berhenti render waktu tab nggak kelihatan
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            sleep();
        } else {
            wake();
        }
    });

    /* ---------- loop utama ---------- */
    function tick() {
        if (!running) return;

        // kalau sudah kosong, hapus canvas sekali lalu berhenti
        if (parts.length === 0 && rockets.length === 0) {
            if (dirty) {
                ctx.clearRect(0, 0, W, H);
                dirty = false;
            }
            running = false;
            rafId = null;
            return;
        }

        ctx.clearRect(0, 0, W, H);
        dirty = true;

        // roket kembang api
        for (var i = rockets.length - 1; i >= 0; i--) {
            var r = rockets[i];
            r.px = r.x; r.py = r.y;
            r.x += r.vx; r.y += r.vy; r.vy += 0.12;

            ctx.globalAlpha = 0.95;
            ctx.strokeStyle = r.color;
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(r.px, r.py);
            ctx.lineTo(r.x, r.y);
            ctx.stroke();

            if (r.vy >= 0 || r.y <= r.to) {
                burst(r.x, r.y, {
                    count: 58, speed: 8.5, gravity: 0.06,
                    drag: 0.962, decay: 0.013, emojiCount: 3
                });
                rockets.splice(i, 1);
            }
        }

        // partikel
        for (var j = parts.length - 1; j >= 0; j--) {
            var p = parts[j];
            p.vx *= p.drag; p.vy *= p.drag;
            p.vy += p.gravity;
            p.x += p.vx; p.y += p.vy;
            p.rot += p.vr;
            p.life -= p.decay;

            if (p.life <= 0 || p.y > H + 90) { parts.splice(j, 1); continue; }

            var a = p.life > 1 ? 1 : p.life;

            if (p.kind === 'rect') {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.globalAlpha = a;
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, Math.max(1.5, p.h * Math.abs(Math.cos(p.rot))));
                ctx.restore();
            } else if (p.kind === 'heart') {
                drawHeart(p.x, p.y, p.s, p.rot, p.color, a);
            } else if (p.kind === 'spark') {
                ctx.save();
                ctx.globalAlpha = a;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(0.5, p.s * a), 0, 6.283);
                ctx.fill();
                ctx.restore();
            } else if (p.kind === 'emoji') {
                ctx.save();
                ctx.globalAlpha = a;
                ctx.font = p.s + 'px "Segoe UI Emoji","Apple Color Emoji",sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.fillText(p.text, 0, 0);
                ctx.restore();
            }
        }

        ctx.globalAlpha = 1;
        rafId = requestAnimationFrame(tick);
    }

    window.FX = {
        burst: burst,
        heartFloat: heartFloat,
        sparkle: sparkle,
        firework: firework,
        fireworks: fireworks,
        celebrate: celebrate
    };
})();
