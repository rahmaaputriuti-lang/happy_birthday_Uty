/* ============================================================
   last.js — Halaman Penutup "Momen Indah Kita"
   ============================================================ */
(function () {
    'use strict';

    /* ---------- pecah judul jadi kata + huruf ---------- */
    function splitWords(el) {
        var words = el.textContent.split(' ');
        el.textContent = '';
        words.forEach(function (word, wi) {
            var w = document.createElement('span');
            w.className = 'word';
            word.split('').forEach(function (ch) {
                var s = document.createElement('span');
                s.className = 'char';
                s.textContent = ch;
                w.appendChild(s);
            });
            el.appendChild(w);
            if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
        });
    }

    document.querySelectorAll('.split').forEach(splitWords);

    /* ---------- kursor kustom (hanya untuk yang pakai mouse) ---------- */
    var hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var dot = document.querySelector('.cursor-dot');
    var ring = document.querySelector('.cursor-ring');
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;
    var lastSpark = 0;

    if (hasMouse) {
        document.addEventListener('mousemove', function (e) {
            mx = e.clientX; my = e.clientY;
            dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';

            var now = Date.now();
            if (now - lastSpark > 70) {
                lastSpark = now;
                FX.sparkle(mx, my, 1);
            }
        });

        (function followRing() {
            rx += (mx - rx) * 0.18;
            ry += (my - ry) * 0.18;
            ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
            requestAnimationFrame(followRing);
        })();

        document.querySelectorAll('a, button').forEach(function (b) {
            b.addEventListener('mouseenter', function () { ring.classList.add('grow'); });
            b.addEventListener('mouseleave', function () { ring.classList.remove('grow'); });
        });
    }

    /* ---------- tilt 3D untuk kartu ---------- */
    document.querySelectorAll('.memory-card').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var r = card.getBoundingClientRect();
            var px = (e.clientX - r.left) / r.width - 0.5;
            var py = (e.clientY - r.top) / r.height - 0.5;
            gsap.to(card, {
                rotateY: px * 14,
                rotateX: -py * 14,
                scale: 1.03,
                duration: 0.4,
                transformPerspective: 1000,
                ease: 'power2.out'
            });
        });
        card.addEventListener('mouseleave', function () {
            gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
        });
        card.addEventListener('click', function (e) {
            FX.heartFloat(e.clientX, e.clientY, { count: 8 });
        });
    });

    /* ---------- reveal on scroll ---------- */
    var finalePlayed = false;

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('shown');
            io.unobserve(entry.target);

            // saat pesan penutup muncul → rayakan sebentar
            if (entry.target.classList.contains('final-message') && !finalePlayed && !reduced) {
                finalePlayed = true;
                setTimeout(function () {
                    FX.burst(window.innerWidth / 2, window.innerHeight * 0.45, { count: 60, speed: 12, emojiCount: 5 });
                    FX.heartFloat(window.innerWidth / 2, window.innerHeight * 0.6, { count: 12 });
                    FX.celebrate({ waves: 2, fireworkSeconds: 4 });
                }, 500);
            }
        });
    }, { threshold: 0.18 });

    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

    /* ---------- emoji melayang (sedikit, sekali aja) ---------- */
    var EMOJIS = ['💖', '🌸', '💕', '🩷'];
    function createFloating() {
        var el = document.createElement('div');
        el.className = 'floating';
        el.textContent = EMOJIS[(Math.random() * EMOJIS.length) | 0];
        el.style.left = Math.random() * 90 + 5 + '%';
        el.style.top = (Math.random() * 30 + 68) + 'vh';
        el.style.fontSize = (Math.random() * 8 + 14) + 'px';
        document.body.appendChild(el);

        gsap.to(el, {
            y: -(window.innerHeight + 120),
            x: Math.random() * 50 - 25,
            opacity: 0.5,
            duration: Math.random() * 8 + 12,
            ease: 'none',
            onComplete: function () { el.remove(); }
        });
    }

    /* ---------- tombol rayain lagi (sengaja diklik, jadi boleh rame) ---------- */
    document.getElementById('party-btn').addEventListener('click', function (e) {
        FX.burst(e.clientX, e.clientY, { count: 60, speed: 12, emojiCount: 5 });
        FX.heartFloat(e.clientX, e.clientY, { count: 12 });
        FX.celebrate({ waves: 2, fireworkSeconds: 4 });
    });

    /* ---------- animasi masuk ---------- */
    window.addEventListener('load', function () {
        gsap.timeline({ defaults: { ease: 'power3.out' } })
            .fromTo('.eyebrow', { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.5 })
            .fromTo('.char',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.45, stagger: 0.018 },
                '-=0.25')
            .fromTo('.welcome-sub', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
            .fromTo('.scroll-cue', { opacity: 0 }, { opacity: .75, duration: 0.5 }, '-=0.3');

        // sambutan: kembang api sebentar lalu berhenti
        if (!reduced) {
            FX.fireworks(window.innerWidth < 768 ? 3 : 4);
            FX.burst(window.innerWidth / 2, window.innerHeight * 0.35, { count: 45, speed: 12, emojiCount: 4 });

            createFloating();
            setInterval(createFloating, window.innerWidth < 768 ? 9500 : 6500);
        }
    });
})();
