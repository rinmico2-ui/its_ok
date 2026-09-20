/* ============================================================
   COMFORT & ENCOURAGEMENT WEBSITE — script.js
   ============================================================ */

/* ===== CONFIG ===== */
const CONFIG = {
    // Set your exam date + time (local). Used for the countdown.
    examDateTime: new Date('2026-09-18T09:00:00'),

    playlist: [
        { title: '☀️ Sunny Days',       file: 'music/sunny-days.mp3' },
        { title: '🌙 Calm Down',        file: 'music/calm-down.mp3' },
        { title: '🌸 Little Comfort',   file: 'music/little-comfort.mp3' },
        { title: "⭐ You've Got This",  file: 'music/you-got-this.mp3' },
        { title: '💗 For You',          file: 'music/for-you.mp3' }
    ],

    examMessages: [
        'You thought it was hard.',
        "That's okay.",
        "You don't know your result yet.",
        "So don't punish yourself over something you can't change right now."
    ],

    feelings: {
        worried: [
            "I know you're thinking about all the questions you might have gotten wrong...",
            "But you don't have your result yet.",
            "Don't turn uncertainty into a bad result before you even know what happened."
        ],
        tired: [
            "Then you definitely need to rest.",
            "Your brain has worked hard today.",
            "Let's save the worrying for another day. 🌙"
        ],
        'better-could': [
            "Maybe you could have.",
            "Maybe you couldn't.",
            "But you can't change today's answers anymore.",
            "What you CAN do is take care of yourself and prepare for tomorrow."
        ],
        better: [
            "There she is! 🥹💗",
            "Keep that little smile.",
            "You deserve it."
        ]
    },

    catchMessages: [
        '+1 courage!', '+1 confidence!', '+1 happiness!',
        '+1 brain power!', '+1 hug!', '+1 determination!',
        '+1 resilience!', '+1 sparkle!', '+1 good vibes!', '+1 strength!'
    ],

    gameItems: ['💗', '⭐', '🌟', '💖', '✨', '🌸', '💫', '🦋', '💕', '🩷'],

    rotatingMessages: [
        '💌 Someone is cheering for you.',
        '🌸 Be gentle with yourself today.',
        "💗 You don't have to have everything figured out.",
        '🌙 The exam is over. Let your brain rest.',
        '☀️ Tomorrow is a fresh start.',
        "⭐ One difficult exam doesn't erase all your hard work.",
        '🫂 Consider this your virtual hug.',
        '🥺 Stop overthinking, silly.',
        "💗 I'm proud of you."
    ],

    sounds: {
        pop: 'sounds/pop.mp3',
        hug: 'sounds/hug.mp3',
        catch: 'sounds/catch.mp3',
        celebrate: 'sounds/celebrate.mp3'
    }
};

/* ===== STATE ===== */
let currentSection = 'sec-opening';
let audio = null;
let isPlaying = false;
let currentSong = 0;
let gameScore = 0;
let gameActive = false;
let gameInterval = null;
let breathingCycles = 0;
let rotatingIdx = 0;
let rotatingInterval = null;
let countdownInterval = null;
let examMsgIdx = 0;

/* ===== HELPERS ===== */
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initCountdown();
    initRotatingMsg();
    initAudio();
    initOpening();
    initExamSection();
    initHug();
    initMission();
    initTomorrow();
    initFeelings();
    initBreathing();
    initMusic();
    initGame();
    initSurprise();
    initCelebration();
});

/* ===== AUDIO ===== */
let bgmStarted = false;

function initAudio() {
    audio = new Audio();
    audio.volume = 0.35;
    audio.loop = false;
    audio.preload = 'auto';
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', playNext);
    audio.addEventListener('error', () => {});
    // Preload Sunny Days so it's ready to play instantly
    audio.src = CONFIG.playlist[0].file;
    audio.load();
}

function startBGM() {
    if (bgmStarted) return;
    bgmStarted = true;
    audio.currentTime = 0;
    audio.volume = 0.35;
    isPlaying = true;
    updatePlayBtn();
    audio.play().catch(() => {});
    $('#capy-music').classList.add('music-playing');
}
function playSfx(key) {
    const f = CONFIG.sounds[key];
    if (!f) return;
    const s = new Audio(f);
    s.volume = 0.45;
    s.play().catch(() => {});
}

/* ===== PARTICLES ===== */
function initParticles() {
    const layer = $('#particles-layer');
    const hearts = ['💗','💕','💖','❤️','🩷','💜'];
    const stars  = ['⭐','🌟','✨','💫'];
    for (let i = 0; i < 22; i++) {
        const el = document.createElement('div');
        const r = Math.random();
        if (r < 0.3) {
            el.className = 'floating-heart';
            el.textContent = hearts[~~(Math.random()*hearts.length)];
        } else if (r < 0.55) {
            el.className = 'floating-star';
            el.textContent = stars[~~(Math.random()*stars.length)];
        } else if (r < 0.8) {
            el.className = 'sparkle';
            const sz = 3 + Math.random()*4;
            el.style.width = sz+'px'; el.style.height = sz+'px';
            el.style.background = ['#ffeaa7','#ffb6c1','#e6d7f1','#b8d4e3'][~~(Math.random()*4)];
        } else {
            el.className = 'floating-bubble';
            const sz = 6 + Math.random()*8;
            el.style.width = sz+'px'; el.style.height = sz+'px';
        }
        el.style.left = Math.random()*100+'%';
        el.style.animationDuration = (9+Math.random()*14)+'s';
        el.style.animationDelay = (Math.random()*16)+'s';
        layer.appendChild(el);
    }
}

/* ===== SECTION NAV ===== */
function goTo(id) {
    const cur = $(`.section.active`);
    const nxt = $(`#${id}`);
    if (!nxt || id === currentSection) return;
    cur.classList.remove('active');
    setTimeout(() => {
        nxt.classList.add('active');
        currentSection = id;
        nxt.scrollTop = 0;
        if (id !== 'sec-opening') $('#bottom-bar').classList.remove('hidden');
        if (id === 'sec-game') startGame();
    }, 350);
}

/* ===== COUNTDOWN ===== */
function initCountdown() {
    tickCountdown();
    countdownInterval = setInterval(tickCountdown, 1000);
}
function tickCountdown() {
    const now = new Date();
    const diff = CONFIG.examDateTime - now;
    if (diff <= 0) {
        $('#cd-h').textContent = '00';
        $('#cd-m').textContent = '00';
        $('#cd-s').textContent = '00';
        $('.counter-label').textContent = "GO GET 'EM! ⭐📚";
        $$('.cd-unit span').forEach(s => s.classList.add('cd-done'));
        clearInterval(countdownInterval);
        return;
    }
    const h = Math.floor(diff/3600000);
    const m = Math.floor((diff%3600000)/60000);
    const s = Math.floor((diff%60000)/1000);
    $('#cd-h').textContent = String(h).padStart(2,'0');
    $('#cd-m').textContent = String(m).padStart(2,'0');
    $('#cd-s').textContent = String(s).padStart(2,'0');
}

/* ===== ROTATING MESSAGES ===== */
function initRotatingMsg() {
    showRotMsg();
    rotatingInterval = setInterval(() => {
        rotatingIdx = (rotatingIdx+1) % CONFIG.rotatingMessages.length;
        const el = $('#rotating-msg');
        el.style.opacity = '0';
        setTimeout(() => { el.textContent = CONFIG.rotatingMessages[rotatingIdx]; el.style.opacity = '1'; }, 350);
    }, 7500);
}
function showRotMsg() {
    $('#rotating-msg').textContent = CONFIG.rotatingMessages[rotatingIdx];
}

/* ===== S: OPENING ===== */
function initOpening() {
    $('#btn-feel-better').addEventListener('click', () => {
        startBGM();
        goTo('sec-exam');
    });
}

/* ===== S: EXAM WORRY ===== */
function initExamSection() {
    const msgs = CONFIG.examMessages;
    let idx = 0;
    const card = $('#exam-msg-card');
    const txt = $('#exam-msg');
    const nextBtn = $('#btn-exam-next');
    const extra = $('#exam-extra');
    const reassure = $('#exam-reassure');
    const butBtn = $('#btn-but-what');

    // Show messages one by one on "Continue" clicks
    nextBtn.classList.remove('hidden');
    nextBtn.addEventListener('click', () => {
        idx++;
        if (idx < msgs.length) {
            animateMsg(txt, msgs[idx]);
        }
        if (idx === msgs.length - 1) {
            nextBtn.classList.add('hidden');
            extra.classList.remove('hidden');
        }
    });

    butBtn.addEventListener('click', () => {
        extra.classList.add('hidden');
        reassure.classList.remove('hidden');
    });

    $('#btn-to-hug').addEventListener('click', () => goTo('sec-hug'));
}

function animateMsg(el, text) {
    el.style.animation = 'none';
    el.offsetHeight;
    el.textContent = text;
    el.style.animation = 'fadeInUp 0.5s var(--ease-bounce)';
}

/* ===== S: HUG ===== */
function initHug() {
    const btn = $('#btn-hug');
    const msgs = $('#hug-messages');
    const heartsEl = $('#hug-hearts');
    const capy = $('#capy-hug');

    btn.addEventListener('click', () => {
        btn.classList.add('hidden');
        // Capybara moves toward screen
        capy.style.transform = 'scale(1.2) translateY(-10px)';
        // Spawn hearts
        heartsEl.classList.remove('hidden');
        spawnBurstHearts(heartsEl);
        playSfx('hug');
        // Show messages after a beat
        setTimeout(() => {
            msgs.classList.remove('hidden');
            capy.style.transform = '';
        }, 800);
    });

    $('#btn-to-mission').addEventListener('click', () => goTo('sec-mission'));
}

function spawnBurstHearts(container) {
    for (let i = 0; i < 12; i++) {
        const h = document.createElement('span');
        h.className = 'burst-heart';
        h.textContent = ['💗','💕','💖','❤️','🩷'][~~(Math.random()*5)];
        h.style.left = (30+Math.random()*40)+'%';
        h.style.top = (30+Math.random()*40)+'%';
        const dx = (Math.random()-0.5)*120;
        const dy = -(40+Math.random()*80);
        const rot = (Math.random()-0.5)*60;
        h.style.setProperty('--dx', dx+'px');
        h.style.setProperty('--dy', dy+'px');
        h.style.setProperty('--rot', rot+'deg');
        container.appendChild(h);
        setTimeout(() => h.remove(), 1600);
    }
}

/* ===== S: TONIGHT'S MISSION ===== */
function initMission() {
    const checks = $$('.check-item input');
    const sign = $('#mission-sign');
    const done = $('#mission-done');
    const checklist = $('#checklist');
    let completed = 0;

    checks.forEach(c => {
        c.addEventListener('change', () => {
            const item = c.closest('.check-item');
            if (c.checked) {
                completed++;
                item.classList.add('celebrating');
                setTimeout(() => item.classList.remove('celebrating'), 400);
                // Small capybara reaction
                const capy = $('#capy-mission');
                capy.style.transform = 'scale(1.08)';
                setTimeout(() => { capy.style.transform = ''; }, 300);
                playSfx('pop');

                if (completed >= checks.length) {
                    setTimeout(missionComplete, 500);
                }
            } else {
                completed = Math.max(0, completed-1);
            }
        });
    });

    function missionComplete() {
        checklist.classList.add('hidden');
        done.classList.remove('hidden');
        sign.textContent = '⭐ Done!';
        spawnConfetti($('#capy-mission-done').closest('.section-inner'), 25);
        playSfx('celebrate');
    }

    $('#btn-to-tomorrow').addEventListener('click', () => goTo('sec-tomorrow'));
}

/* ===== S: TOMORROW ===== */
function initTomorrow() {
    const extra = $('#tomorrow-extra');
    const motBtn = $('#btn-tomorrow-motivation');

    motBtn.addEventListener('click', () => {
        motBtn.classList.add('hidden');
        extra.classList.remove('hidden');
    });

    $('#btn-to-feelings').addEventListener('click', () => goTo('sec-feelings'));
}

/* ===== S: FEELINGS ===== */
function initFeelings() {
    const btns = $$('.btn-feeling');
    const resp = $('#feeling-response');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const feeling = btn.dataset.feeling;
            const msgs = CONFIG.feelings[feeling];
            if (!msgs) return;

            $('#feelings-buttons').classList.add('hidden');
            resp.classList.remove('hidden');

            // Set messages
            $('#feeling-msg1').textContent = msgs[0];
            for (let i = 1; i < 4; i++) {
                const card = $(`#feeling-msg${i+1}-card`);
                const txt = $(`#feeling-msg${i+1}`);
                if (msgs[i]) {
                    card.classList.remove('hidden');
                    txt.textContent = msgs[i];
                } else {
                    card.classList.add('hidden');
                }
            }

            // Capybara reaction
            const capy = $('#capy-feelings');
            const mouth = capy.querySelector('.capy-mouth');
            if (feeling === 'better') {
                capy.className = 'capybara capy-happy';
                mouth.className = 'capy-mouth capy-happy-wide';
            } else {
                capy.className = 'capybara capy-comforting';
                mouth.className = 'capy-mouth capy-gentle';
            }

            // Show next button
            const nextBtn = $('#btn-feeling-next');
            nextBtn.classList.remove('hidden');
        });
    });

    $('#btn-feeling-next').addEventListener('click', () => goTo('sec-breathing'));
}

/* ===== S: BREATHING ===== */
function initBreathing() {
    const circle = $('#breathing-circle');
    const textEl = $('#breathing-text');
    const instrEl = $('#breathing-instruction');
    const doneEl = $('#breathing-complete');
    breathingCycles = 0;

    circle.addEventListener('click', startBreath);

    function startBreath() {
        circle.removeEventListener('click', startBreath);
        instrEl.textContent = '';
        runCycle();
    }

    function runCycle() {
        if (breathingCycles >= 3) { finishBreath(); return; }
        circle.className = 'breathing-circle inhale';
        textEl.textContent = 'Breathe in...';
        setTimeout(() => {
            circle.className = 'breathing-circle hold';
            textEl.textContent = 'Hold...';
            setTimeout(() => {
                circle.className = 'breathing-circle exhale';
                textEl.textContent = 'Breathe out...';
                setTimeout(() => { breathingCycles++; runCycle(); }, 4000);
            }, 3000);
        }, 4000);
    }

    function finishBreath() {
        circle.className = 'breathing-circle';
        textEl.textContent = '🌸';
        doneEl.classList.remove('hidden');
        instrEl.classList.add('hidden');
    }

    $('#btn-breathing-next').addEventListener('click', () => goTo('sec-music'));
}

/* ===== S: MUSIC ===== */
function initMusic() {
    // Sync volume slider with current audio volume
    $('#volume-slider').value = Math.round(audio.volume * 100);

    $('#btn-play').addEventListener('click', togglePlay);
    $('#btn-prev').addEventListener('click', playPrev);
    $('#btn-next').addEventListener('click', playNext);
    $('#volume-slider').addEventListener('input', e => {
        audio.volume = e.target.value / 100;
    });
    $('#progress-container').addEventListener('click', e => {
        if (!audio || !audio.duration) return;
        const r = e.currentTarget.getBoundingClientRect();
        audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
    });
    $$('.playlist-item').forEach(el => {
        el.addEventListener('click', () => selectSong(+el.dataset.song));
    });
    $('#btn-music-next').addEventListener('click', () => goTo('sec-game'));
}

function selectSong(i) {
    currentSong = i;
    $$('.playlist-item').forEach((el, j) => el.classList.toggle('active', j === i));
    $('#now-playing').textContent = CONFIG.playlist[i].title;
    loadSong();
    if (!isPlaying) {
        isPlaying = true;
        updatePlayBtn();
    }
}
function togglePlay() { isPlaying ? pause() : play(); }
function play() {
    if (audio.paused) {
        audio.play().catch(() => {});
    } else {
        loadSong();
    }
    isPlaying = true;
    updatePlayBtn();
    $('#capy-music').classList.add('music-playing');
}
function pause() {
    if (audio) audio.pause();
    isPlaying = false;
    updatePlayBtn();
    $('#capy-music').classList.remove('music-playing');
}
function loadSong() {
    if (!audio) return;
    const wasPlaying = !audio.paused && bgmStarted;
    audio.src = CONFIG.playlist[currentSong].file;
    audio.load();
    if (wasPlaying || bgmStarted) {
        audio.play().catch(() => {});
    }
}
function playNext() { currentSong=(currentSong+1)%CONFIG.playlist.length; selectSong(currentSong); }
function playPrev() { currentSong=(currentSong-1+CONFIG.playlist.length)%CONFIG.playlist.length; selectSong(currentSong); }
function updatePlayBtn() { $('#btn-play').textContent = isPlaying ? '⏸' : '▶'; }
function onTimeUpdate() {
    if(!audio||!audio.duration) return;
    $('#progress-bar').style.width = (audio.currentTime/audio.duration*100)+'%';
    $('#time-current').textContent = fmt(audio.currentTime);
    $('#time-total').textContent = fmt(audio.duration);
}
function fmt(s) { const m=~~(s/60), sec=~~(s%60); return m+':'+(sec<10?'0':'')+sec; }

/* ===== S: GAME ===== */
function initGame() {
    const area = $('#game-area');
    area.addEventListener('click', e => {
        if(!gameActive) return;
        const item = e.target.closest('.game-item');
        if(item && !item.classList.contains('caught')) catchItem(item);
    });
    area.addEventListener('touchstart', e => {
        if(!gameActive) return;
        const t = e.touches[0];
        const el = document.elementFromPoint(t.clientX, t.clientY);
        if(el&&el.classList.contains('game-item')&&!el.classList.contains('caught')) catchItem(el);
    }, {passive:true});

    $('#btn-game-done').addEventListener('click', () => goTo('sec-letter'));
}

function startGame() {
    clearInterval(gameInterval);
    gameScore=0; gameActive=true;
    $('#game-score').textContent='0';
    $('#game-message').textContent='';
    $('#game-message').style.fontSize='';
    $('#btn-game-done').classList.add('hidden');
    const area=$('#game-area');
    area.querySelectorAll('.game-item, .catch-msg, .confetti-piece').forEach(e=>e.remove());
    $('#capy-game').className='capybara capy-game';
    spawnItem();
    gameInterval=setInterval(spawnItem,900);
}
function spawnItem() {
    if(!gameActive) return;
    const area=$('#game-area');
    const el=document.createElement('div');
    el.className='game-item';
    el.textContent=CONFIG.gameItems[~~(Math.random()*CONFIG.gameItems.length)];
    el.style.left=(8+Math.random()*82)+'%';
    el.style.animationDuration=(2+Math.random()*1.8)+'s';
    area.appendChild(el);
    el.addEventListener('animationend',()=>el.remove());
}
function catchItem(item) {
    item.classList.add('caught');
    gameScore++; $('#game-score').textContent=gameScore;
    const msg=CONFIG.catchMessages[Math.min(gameScore-1,CONFIG.catchMessages.length-1)];
    showCatchMsg(item,msg);
    setTimeout(()=>item.remove(),280);
    playSfx('catch');
    if(gameScore>=10) gameDone();
}
function showCatchMsg(item,msg) {
    const area=$('#game-area');
    const el=document.createElement('div');
    el.className='catch-msg'; el.textContent=msg;
    el.style.left=item.style.left; el.style.top='45%';
    area.appendChild(el);
    setTimeout(()=>el.remove(),900);
}
function gameDone() {
    gameActive=false; clearInterval(gameInterval);
    $('#game-message').textContent='🎉 CONFIDENCE RESTORED! 💗';
    $('#game-message').style.fontSize='1.1rem';
    $('#btn-game-done').classList.remove('hidden');
    const capy=$('#capy-game');
    capy.className='capybara capy-celebrate';
    spawnConfetti($('#game-area'),35);
    playSfx('celebrate');
}

/* ===== S: SURPRISE ===== */
function initSurprise() {
    $('#btn-one-more').addEventListener('click', () => goTo('sec-surprise'));
    $('#btn-rest').addEventListener('click', () => goTo('sec-celebrate'));
}

/* ===== S: CELEBRATION ===== */
function initCelebration() {}

function triggerCelebration() {
    spawnConfetti($('#confetti-canvas'),80);
    playSfx('celebrate');
    let n=0;
    const iv=setInterval(()=>{ spawnConfetti($('#confetti-canvas'),15); if(++n>8) clearInterval(iv); },600);
}

/* ===== CONFETTI ===== */
function spawnConfetti(container, count=30) {
    if(!container) return;
    const colors=['#ffb6c1','#e6d7f1','#ffeaa7','#b8d4e3','#ff85a2','#c9a9e0','#fdcb6e','#81ecec','#ffd6de'];
    for(let i=0;i<count;i++){
        const el=document.createElement('div');
        el.className='confetti-piece';
        el.style.left=Math.random()*100+'%';
        el.style.top='-20px';
        el.style.background=colors[~~(Math.random()*colors.length)];
        const sz=6+Math.random()*8;
        el.style.width=sz+'px'; el.style.height=sz+'px';
        el.style.borderRadius=Math.random()>0.5?'50%':'2px';
        el.style.animationDuration=(2+Math.random()*3)+'s';
        el.style.animationDelay=(Math.random()*0.4)+'s';
        container.appendChild(el);
        setTimeout(()=>el.remove(),5500);
    }
}

/* ===== TRIGGER CELEBRATION WHEN SECTION ENTERS ===== */
const celebObs = new MutationObserver(() => {
    if($('#sec-celebrate').classList.contains('active')) {
        triggerCelebration();
        celebObs.disconnect();
    }
});
celebObs.observe($('#sec-celebrate'), {attributes:true, attributeFilter:['class']});

/* ===== KEYBOARD NAV (dev) ===== */
document.addEventListener('keydown', e => {
    if(e.key==='ArrowRight'){
        const order=['sec-opening','sec-exam','sec-hug','sec-mission','sec-tomorrow','sec-feelings','sec-breathing','sec-music','sec-game','sec-letter','sec-surprise','sec-celebrate'];
        const i=order.indexOf(currentSection);
        if(i<order.length-1) goTo(order[i+1]);
    }
});
