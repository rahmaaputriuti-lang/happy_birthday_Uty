/* ============================================================
   script.js — Halaman Pembuka
   ============================================================ */
(function () {
    'use strict';

    var CFG = window.BIRTHDAY_CONFIG || {};
    var NAMA = CFG.nama || 'Sayang';

    /* ---------- isi nama ---------- */
    var nameEl = document.getElementById('js-name');
    if (nameEl) nameEl.textContent = NAMA;

    /* ---------- pecah teks jadi kata + huruf ---------- */
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
    var dot = document.querySelector('.cursor-dot');
    var ring = document.querySelector('.cursor-ring');
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;
    var lastSpark = 0;

    if (hasMouse) {
        document.addEventListener('mousemove', function (e) {
            mx = e.clientX; my = e.clientY;
            dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';

            // jejak sparkle tipis, dibatasi biar tidak bikin pusing
            var now = Date.now();
            if (now - lastSpark > 70) {
                lastSpark = now;
                FX.sparkle(mx, my, 1);
            }
        });

        // lingkaran kursor meluncur mengikuti (hanya jalan kalau ada mouse)
        (function followRing() {
            rx += (mx - rx) * 0.18;
            ry += (my - ry) * 0.18;
            ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
            requestAnimationFrame(followRing);
        })();

        document.querySelectorAll('button').forEach(function (b) {
            b.addEventListener('mouseenter', function () { ring.classList.add('grow'); });
            b.addEventListener('mouseleave', function () { ring.classList.remove('grow'); });
        });
    }

    /* ---------- beberapa emoji melayang pelan (sekali aja) ---------- */
    var EMOJIS = ['💖', '🌸', '💕', '🩷'];
    function createFloating() {
        var el = document.createElement('div');
        el.className = 'floating';
        el.textContent = EMOJIS[(Math.random() * EMOJIS.length) | 0];
        el.style.left = Math.random() * 90 + 5 + 'vw';
        el.style.top = (Math.random() * 30 + 70) + 'vh';
        el.style.fontSize = (Math.random() * 10 + 16) + 'px';
        document.body.appendChild(el);

        gsap.to(el, {
            y: -(window.innerHeight + 120),
            x: Math.random() * 60 - 30,
            opacity: 0.55,
            duration: Math.random() * 8 + 12,
            ease: 'none',
            onComplete: function () { el.remove(); }
        });
    }

    /* ---------- efek ketik ---------- */
    var greetingEl = document.querySelector('.greeting');
    var caretEl = document.querySelector('.caret');
    var text = CFG.sapaan || 'Selamat ulang tahun ya, sayang ... 💖';
    var idx = 0;

    function typeGreeting() {
        if (idx < text.length) {
            greetingEl.textContent += text.charAt(idx);
            idx++;
            setTimeout(typeGreeting, text.charAt(idx - 1) === ' ' ? 45 : 62);
        } else {
            caretEl.style.animationDuration = '1.4s';
        }
    }

    /* ---------- animasi masuk (sekali jalan) ---------- */
    window.addEventListener('load', function () {
        var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo('.glass',
            { opacity: 0, y: 26 },
            { opacity: 1, y: 0, duration: .9 })
            .fromTo('.eyebrow', { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: .5 }, '-=0.5')
            .fromTo('.hero-photo',
                { opacity: 0, y: 26, scale: .9, rotation: -12 },
                { opacity: 1, y: 0, scale: 1, rotation: -3, duration: .7, clearProps: 'transform,opacity' },
                '-=0.3')
            .fromTo('.char',
                { opacity: 0, y: 22 },
                { opacity: 1, y: 0, duration: .5, stagger: 0.02 },
                '-=0.25')
            .fromTo('.cta-button', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .6 })
            .fromTo('.hint', { opacity: 0 }, { opacity: 1, duration: .5 }, '-=0.2')
            .fromTo('.music-btn', { opacity: 0, scale: .8 }, { opacity: 1, scale: 1, duration: .5 }, '-=0.4');

        // efek ketik dijalankan pakai setTimeout biasa, bukan dari dalam timeline GSAP.
        // GSAP jalan lewat requestAnimationFrame yang bisa berhenti waktu tab
        // di-background; biar sapaan tetap muncul walau tab sempat ke-unsur lain.
        gsap.fromTo('.greeting-wrap', { opacity: 0 }, { opacity: 1, duration: .4, delay: 1.4 });
        setTimeout(function () { typeGreeting(); }, 1500);

        // sambutan: konfeti + kembang api sekali, lalu berhenti
        var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!reduced) {
            FX.burst(window.innerWidth / 2, window.innerHeight * 0.4, { count: 55, speed: 12, emojiCount: 5 });
            setTimeout(function () { FX.fireworks(window.innerWidth < 768 ? 2 : 3); }, 800);

            // emoji melayang pelan, satu per satu
            createFloating();
            setInterval(createFloating, window.innerWidth < 768 ? 9000 : 6000);
        }
    });

    /* ---------- interaksi tombol ---------- */
    var btn = document.querySelector('.cta-button');
    var entered = false;

    btn.addEventListener('click', function (e) {
        if (entered) return;
        entered = true;

        FX.burst(e.clientX, e.clientY, { count: 60, speed: 12, emojiCount: 4 });
        FX.heartFloat(e.clientX, e.clientY, { count: 8 });

        gsap.timeline()
            .to('.glass', { scale: 1.03, duration: .16, ease: 'power2.out' })
            .to('.glass', { scale: .95, opacity: 0, filter: 'blur(6px)', duration: .7, ease: 'power2.in' })
            .to('body', { opacity: 0, duration: .5 }, '-=0.3')
            .add(function () { window.location.href = 'cause.html'; });
    });

    /* ---------- musik: pindah ke music.js (bersama semua halaman) ---------- */
})();
