/* ============================================================
   cause.js — Halaman "Kenapa Kamu Istimewa"
   ============================================================ */
(function () {
    'use strict';

    var CFG = window.BIRTHDAY_CONFIG || {};
    var NAMA = CFG.nama || 'Sayang';

    var nameEl = document.getElementById('js-name');
    if (nameEl) nameEl.textContent = NAMA;

    /* ---------- database alasan (Bahasa Indonesia) ---------- */
    var reasons = [
        {
            text: 'Kamu orangnya tenang. Nggak suka ribut-ribut, dan justru itu yang bikin aku betah lama-lama di dekat kamu.',
            emoji: '🌟',
            gif: 'cat-smile.svg'
        },
        {
            text: 'Kamu nerima aku apa adanya, lengkap sama ribetnya. Nggak perlu aku pura-pura jadi orang lain di depan kamu.',
            emoji: '😊',
            gif: 'cat-cubit.svg'
        },
        {
            text: 'Hati kamu lembut, tapi cara kamu mikirnya dalam. Hal kecil pun bisa kamu renungkan sampai jadi sesuatu yang berarti.',
            emoji: '🎂',
            gif: 'cat-party.svg'
        },
        {
            text: 'Kamu tipe yang gengsian, susah ngaku kangen padahal pengen banget ketemu. Santai aja, aku mau denger sinyalmu yang pelan itu.',
            emoji: '😄',
            gif: 'cat-heart.svg'
        },
        {
            text: 'Kamu biasa pegang masalah sendiri tanpa mau repotin orang lain. Aku respect itu, tapi nggak usah dihadepin sendirian — ada aku, selalu di sini buat kamu.',
            emoji: '🤝',
            gif: 'cat-wink.svg'
        },
        {
            text: 'Di umur 23 ini aku cuma mau kamu sehat dan tenang. Sisanya, kita jalani pelan-pelan bareng.',
            emoji: '🍀',
            gif: 'cat-sleep.svg'
        }
    ];

    /* ---------- elemen ---------- */
    var container = document.getElementById('reasons-container');
    var button = document.querySelector('.shuffle-button');
    var buttonLabel = button.querySelector('.label');
    var counter = document.querySelector('.reason-counter');
    var fill = document.querySelector('.progress-fill');
    var progressText = document.querySelector('.progress-text');

    var current = 0;
    var isTransitioning = false;
    var storyMode = false;

    /* ---------- kursor hati (hanya untuk yang pakai mouse) ---------- */
    var hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var cursor = document.querySelector('.custom-cursor');
    var lastSpark = 0;

    if (hasMouse) {
        document.addEventListener('mousemove', function (e) {
            gsap.to(cursor, { x: e.clientX - 13, y: e.clientY - 13, duration: 0.18, ease: 'power2.out' });

            var now = Date.now();
            if (now - lastSpark > 75) {
                lastSpark = now;
                FX.sparkle(e.clientX, e.clientY, 1);
            }
        });
    }

    /* ---------- efek tilt 3D pada kartu ---------- */
    function attachTilt(card) {
        card.addEventListener('mousemove', function (e) {
            var r = card.getBoundingClientRect();
            var px = (e.clientX - r.left) / r.width - 0.5;
            var py = (e.clientY - r.top) / r.height - 0.5;
            gsap.to(card, {
                rotateY: px * 12,
                rotateX: -py * 12,
                scale: 1.02,
                duration: 0.35,
                transformPerspective: 900,
                ease: 'power2.out'
            });
        });
        card.addEventListener('mouseleave', function () {
            gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
        });

        // klik kartu → sedikit hati
        card.addEventListener('click', function (e) {
            FX.heartFloat(e.clientX, e.clientY, { count: 6 });
        });
    }

    /* ---------- bikin kartu ---------- */
    function createReasonCard(reason, index) {
        var card = document.createElement('div');
        card.className = 'reason-card';

        var badge = document.createElement('div');
        badge.className = 'reason-badge';
        badge.textContent = reason.emoji;

        var body = document.createElement('div');
        body.className = 'reason-body';

        var num = document.createElement('div');
        num.className = 'reason-num';
        num.textContent = 'Alasan ke-' + (index + 1);

        var text = document.createElement('div');
        text.className = 'reason-text';
        text.textContent = reason.text;

        var media = document.createElement('div');
        media.className = 'reason-media';
        media.innerHTML = '<img src="' + reason.gif + '" alt="Kenangan kita" loading="lazy" decoding="async">';

        body.appendChild(num);
        body.appendChild(text);

        card.appendChild(badge);
        card.appendChild(body);
        card.appendChild(media);

        attachTilt(card);
        return card;
    }

    /* ---------- tampilkan alasan baru ---------- */
    function displayNewReason() {
        if (isTransitioning) return;
        if (current >= reasons.length) return;
        isTransitioning = true;

        var card = createReasonCard(reasons[current], current);
        container.appendChild(card);

        gsap.fromTo(card,
            { opacity: 0, y: 26, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'power2.out' });

        current++;

        // progres
        var pct = Math.round((current / reasons.length) * 100);
        fill.style.width = pct + '%';
        progressText.textContent = current + ' dari ' + reasons.length;
        counter.textContent = 'Alasan ke-' + current + ' dari aku.';

        // konfeti kecil dari tengah kartu
        var r = card.getBoundingClientRect();
        FX.burst(r.left + r.width / 2, r.top + r.height / 2, { count: 30, speed: 8, emojiCount: 3 });
        FX.heartFloat(r.left + r.width / 2, r.top + r.height / 2, { count: 5 });

        card.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // kalau semua alasan sudah muncul
        if (current === reasons.length) {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.4,
                ease: 'power2.out',
                onComplete: function () {
                    storyMode = true;
                    button.classList.add('story-mode');
                    buttonLabel.textContent = 'Lanjut Ke Kenangan';
                    gsap.to(button, { scale: 1, duration: 0.4 });
                    counter.textContent = 'Itu tadi sebagian alasannya. Sekarang lihat kenangan kita.';
                    FX.burst(window.innerWidth / 2, window.innerHeight * 0.5, { count: 40, speed: 11, emojiCount: 4 });
                    showEnding();
                }
            });
        }

        setTimeout(function () { isTransitioning = false; }, 550);
    }

    /* ---------- bagian penutup ---------- */
    function showEnding() {
        var ending = document.querySelector('.ending-section');
        var teddy = document.querySelector('.teddy-hug');

        gsap.timeline()
            .to(ending, { opacity: 1, duration: 0.6 })
            .to(teddy, { scale: 1, duration: 0.7, ease: 'power2.out' }, '-=0.2')
            .fromTo('.ending-text', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
            .fromTo('.ending-sub', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3');

        setTimeout(function () {
            ending.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 400);
    }

    /* ---------- klik tombol ---------- */
    button.addEventListener('click', function (e) {
        gsap.fromTo(button, { scale: 0.96 }, { scale: 1, duration: 0.3, ease: 'power2.out' });

        if (storyMode) {
            FX.burst(e.clientX, e.clientY, { count: 40, speed: 10, emojiCount: 3 });
            FX.heartFloat(e.clientX, e.clientY, { count: 8 });
            gsap.timeline()
                .to('body', { filter: 'blur(8px)', duration: 0.7 })
                .to('body', { opacity: 0, duration: 0.5 })
                .add(function () { window.location.href = 'last.html'; });
            return;
        }

        displayNewReason();
    });

    /* ---------- emoji melayang (sedikit, sekali aja) ---------- */
    var EMOJIS = ['🌸', '💖', '⭐', '💗'];
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

    /* ---------- tampilkan langkah 2 (daftar alasan) ---------- */
    function revealStep2(fromCake) {
        // bangun intro dulu (fromTo langsung memasang state awal = tersembunyi),
        // baru buka kontennya — supaya nggak ada kedip
        gsap.timeline({ defaults: { ease: 'power3.out' } })
            .fromTo('.eyebrow', { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.5 })
            .fromTo('h1', { opacity: 0, y: -22 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.3')
            .fromTo('.subtitle', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.4')
            .fromTo('.progress', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.3')
            .fromTo('.shuffle-button', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.2')
            .fromTo('.reason-counter', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.3');
        document.body.classList.remove('step-cake');

        // ambiance; pesta kembang api sudah dilepas di momen tiup lilin (kalau ada kue)
        if (!reduced) {
            if (!fromCake) {
                FX.burst(window.innerWidth / 2, window.innerHeight * 0.35, { count: 40, speed: 11, emojiCount: 4 });
                setTimeout(function () { FX.fireworks(window.innerWidth < 768 ? 2 : 2.5); }, 700);
            }
            createFloating();
            setInterval(createFloating, window.innerWidth < 768 ? 9500 : 6500);
        }
    }

    /* ---------- animasi masuk ---------- */
    window.addEventListener('load', function () {
        var cakeOverlay = document.getElementById('cake-overlay');
        if (!cakeOverlay) {
            revealStep2(false);   // tanpa kue: langsung langkah 2
            return;
        }
        // ada kue: tahan konten (langkah 1) sampai lilin ditiup, baru buka langkah 2
        document.addEventListener('cake:done', function () { revealStep2(true); }, { once: true });
    });
})();
