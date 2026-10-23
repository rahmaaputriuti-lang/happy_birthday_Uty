/* ============================================================
   music.js — tombol musik untuk semua halaman
   Statusnya disimpan di sessionStorage, jadi waktu pindah
   halaman lagunya tetap jalan tanpa perlu diklik ulang.
   ============================================================ */
(function () {
    'use strict';

    var CFG = window.BIRTHDAY_CONFIG || {};
    var btn = document.getElementById('music-btn');
    if (!btn) return;

    var audio = null;
    var KEY = 'birthday_music_on';

    function getAudio() {
        if (!audio) {
            audio = new Audio(CFG.musik || 'music.mp3');
            audio.loop = true;
            audio.volume = 0.5;
        }
        return audio;
    }

    function setUI(playing) {
        btn.classList.toggle('playing', playing);
        btn.textContent = playing ? '🎶' : '🎵';
        btn.setAttribute('aria-label', playing ? 'Matikan musik' : 'Nyalakan musik');
    }

    function play() {
        getAudio().play().then(function () {
            sessionStorage.setItem(KEY, '1');
            setUI(true);
        }).catch(function () {
            // browser menolak autoplay — biarkan tombol dalam keadaan mati
            btn.title = 'Klik tombol ini buat nyalain musik ya';
        });
    }

    function pause() {
        getAudio().pause();
        sessionStorage.removeItem(KEY);
        setUI(false);
    }

    btn.addEventListener('click', function () {
        if (getAudio().paused) {
            play();
        } else {
            pause();
        }
    });

    // kalau tadi sudah nyala, lanjutkan lagi di halaman berikutnya
    if (sessionStorage.getItem(KEY) === '1') {
        play();
    }
})();
