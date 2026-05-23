const testSpin          = getURLParam("test", false);

let SPIN_DURATION_MS    = 15000;
let SPIN_SPEED          = 1;

const ITEM_W            = 192;
let WINNER_POS          = 30 + Math.round(SPIN_SPEED) * 12;
let TOTAL               = WINNER_POS + 15;

let spinning            = false;

let PARTICIPANTS        = [];

let spinWinner          = 0;

// ─── Audio ────────────────────────────────────────────────────────────────────

let audioCtx = null;

function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
}

let scheduledSources = [];

function scheduleTick(ctx, atTime, volume) {
    const len  = Math.ceil(ctx.sampleRate * 0.025);
    const buf  = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);

    for (let i = 0; i < len; i++) {
        const env = Math.pow(1 - i / len, 4);
        data[i] = (Math.random() * 2 - 1) * env;
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;

    const bp = ctx.createBiquadFilter();
    bp.type            = 'bandpass';
    bp.frequency.value = 3000;
    bp.Q.value         = 3.5;

    const gain = ctx.createGain();
    gain.gain.value = volume * 1.6;

    src.connect(bp);
    bp.connect(gain);
    gain.connect(ctx.destination);
    src.start(atTime);

    scheduledSources.push(src);
}

function computeTickTimes(durationSec) {

    const x1 = 0.12, x2 = 0.35;

    function bezierX(t) {
        const u = 1 - t;
        return 3*u*u*t*x1 + 3*u*t*t*x2 + t*t*t;
    }
    function bezierY(t) {
        const y1 = 0.82, y2 = 1.0;
        const u  = 1 - t;
        return 3*u*u*t*y1 + 3*u*t*t*y2 + t*t*t;
    }
    function tFromX(x) {
        let lo = 0, hi = 1;
        for (let i = 0; i < 32; i++) {
            const mid = (lo + hi) / 2;
            if (bezierX(mid) < x) { lo = mid; } else { hi = mid; }
        }
        return (lo + hi) / 2;
    }

    const totalItems = WINNER_POS;
    const times = [];

    for (let item = 1; item <= totalItems; item++) {
        const progress = item / totalItems;
        const t_css    = tFromX(progress);
        const timeFrac = bezierY(t_css);

        times.push(timeFrac * durationSec);
    }

    return times;
}

function computeTickTimesCorrect(durationSec) {
    const x1 = 0.12, y1 = 0.82;
    const x2 = 0.35, y2 = 1.00;

    function bezierCoord(t, p1, p2) {
        const u = 1 - t;
        return 3*u*u*t*p1 + 3*u*t*t*p2 + t*t*t;
    }
    
    const totalItems = WINNER_POS;
    const times = [];

    for (let item = 1; item <= totalItems; item++) {
        const targetY = item / totalItems;

        
        let lo = 0, hi = 1;
        for (let i = 0; i < 48; i++) {
            const mid = (lo + hi) / 2;
            if (bezierCoord(mid, y1, y2) < targetY) { lo = mid; } else { hi = mid; }
        }
        const t = (lo + hi) / 2;
        const timeX = bezierCoord(t, x1, x2);

        times.push(timeX * durationSec);
    }

    return times;
}

function startSpinSound(durationMs) {
    stopSpinSound();

    const ctx      = getAudioCtx();
    const now      = ctx.currentTime;
    const durSec   = durationMs / 1000;
    const times    = computeTickTimesCorrect(durSec);

    times.forEach((t, i) => {
        
        const progress = (i + 1) / times.length;
        const volume   = progress > 0.75
            ? 0.7 * (1 - (progress - 0.75) / 0.25) + 0.15
            : 0.7;

        scheduleTick(ctx, now + t, volume);
    });
}

function stopSpinSound() {
    scheduledSources.forEach(src => { try { src.stop(); } catch (_) {} });
    scheduledSources = [];
}

function playPopperSound(ctx, atTime) {
    
    const bangLen  = Math.ceil(ctx.sampleRate * 0.04);
    const bangBuf  = ctx.createBuffer(1, bangLen, ctx.sampleRate);
    const bangData = bangBuf.getChannelData(0);
    for (let i = 0; i < bangLen; i++) {
        const env    = Math.pow(1 - i / bangLen, 2);
        bangData[i]  = (Math.random() * 2 - 1) * env;
    }
    const bangSrc  = ctx.createBufferSource();
    bangSrc.buffer = bangBuf;

    const bangHp           = ctx.createBiquadFilter();
    bangHp.type            = 'highpass';
    bangHp.frequency.value = 120;

    const bangGain       = ctx.createGain();
    bangGain.gain.value  = 0.45;

    bangSrc.connect(bangHp);
    bangHp.connect(bangGain);
    bangGain.connect(ctx.destination);
    bangSrc.start(atTime);

    
    const rainLen  = Math.ceil(ctx.sampleRate * 0.55);
    const rainBuf  = ctx.createBuffer(1, rainLen, ctx.sampleRate);
    const rainData = rainBuf.getChannelData(0);
    for (let i = 0; i < rainLen; i++) {
        const env    = Math.pow(1 - i / rainLen, 1.4);
        rainData[i]  = (Math.random() * 2 - 1) * env;
    }
    const rainSrc  = ctx.createBufferSource();
    rainSrc.buffer = rainBuf;

    
    const rainBp           = ctx.createBiquadFilter();
    rainBp.type            = 'bandpass';
    rainBp.frequency.value = 700;
    rainBp.Q.value         = 0.6;

    const rainGain       = ctx.createGain();
    rainGain.gain.value  = 0.2;

    rainSrc.connect(rainBp);
    rainBp.connect(rainGain);
    rainGain.connect(ctx.destination);
    rainSrc.start(atTime + 0.01); 
}


function playTadaSound() {
    const ctx = getAudioCtx();

    const convolver = ctx.createConvolver();
    const irLen     = ctx.sampleRate * 0.6;
    const irBuf     = ctx.createBuffer(2, irLen, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
        const d = irBuf.getChannelData(ch);
        for (let i = 0; i < irLen; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / irLen, 2);
    }
    convolver.buffer = irBuf;

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.5;
    convolver.connect(masterGain);
    masterGain.connect(ctx.destination);

    const notes = [
        { freq: 523.25, delay: 0.00, dur: 0.35 },
        { freq: 659.25, delay: 0.10, dur: 0.35 },
        { freq: 783.99, delay: 0.20, dur: 0.35 },
        { freq: 1046.5, delay: 0.28, dur: 0.55 },
    ];

    notes.forEach(({ freq, delay, dur }) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type            = 'triangle';
        osc.frequency.value = freq;
        const t0 = ctx.currentTime + delay;
        gain.gain.setValueAtTime(0, t0);
        gain.gain.linearRampToValueAtTime(0.6, t0 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
        osc.connect(gain);
        gain.connect(convolver);
        gain.connect(ctx.destination);
        osc.start(t0);
        osc.stop(t0 + dur + 0.05);
    });

    playPopperSound(ctx, ctx.currentTime);
    playPopperSound(ctx, ctx.currentTime + 0.12);
}

// ─── Roulette core ────────────────────────────────────────────────────────────

function addParticipant(name, platform = '', avatar = '', userId = '') {
    PARTICIPANTS.push({ name, platform, avatar, userId });
    
    document.querySelector('.spinner-participants span').textContent = PARTICIPANTS.length;

    if (!spinning) populateTrack();
}

function removeParticipant(name) {
    PARTICIPANTS = PARTICIPANTS.filter(p => p.name !== name);
    if (!spinning) populateTrack();
}

function setParticipants(list) {
    PARTICIPANTS = list;
    if (!spinning) populateTrack();
}

function makeAvatarEl(p, big) {
    const el = document.createElement('div');
    el.className = big ? 'winner-avatar-big' : 's-avatar';
    if (p.avatar) {
        const img = document.createElement('img');
        img.src = p.avatar;
        img.alt = p.name;
        img.onerror = () => {
            img.remove();
            el.style.background = createRandomColor();
            el.textContent = p.name.slice(0, 2).toUpperCase();
        };
        el.appendChild(img);
    } else {
        el.style.background = createRandomColor();
        el.textContent = p.name.slice(0, 2).toUpperCase();
    }
    return el;
}

function makeItem(p) {
    const el = document.createElement('div');
    el.dataset.user = p.userId;
    el.className = 's-item' + (p.platform ? ` ${p.platform}` : '');

    const platform = document.createElement('div');
    platform.className = 's-platform';
    platform.innerHTML = `<img src="js/modules/${p.platform}/images/logo-${p.platform}.svg" alt="${p.platform}" class="s-platform">`;
    el.appendChild(platform);

    el.appendChild(makeAvatarEl(p, false));

    const name = document.createElement('div');
    name.className = 's-name';
    name.textContent = p.name;
    el.appendChild(name);

    return el;
}

function populateTrack() {
    const track = document.getElementById('track');
    track.style.transition = 'none';
    track.style.transform = 'translateX(0px)';
    track.innerHTML = '';
    if (PARTICIPANTS.length === 0) return;
    const needed = Math.max(TOTAL, Math.ceil(1800 / ITEM_W) + 4);
    for (let i = 0; i < needed; i++) {
        track.appendChild(makeItem(PARTICIPANTS[i % PARTICIPANTS.length]));
    }
}

function buildSpinTrack(winnerIdx) {
    const track = document.getElementById('track');
    track.innerHTML = '';
    for (let i = 0; i < TOTAL; i++) {
        const p = (i === WINNER_POS)
            ? PARTICIPANTS[winnerIdx]
            : PARTICIPANTS[Math.floor(Math.random() * PARTICIPANTS.length)];
        track.appendChild(makeItem(p));
    }
}

async function readyToSpin() {

    streamerBotClient.doAction({ name: "Winner RouletteRD" }, {
        "rouletterdparticipants": JSON.stringify(PARTICIPANTS),
    }).then((res) => {
        console.debug('[RouletteRD][Settings] Sending winner globally...', res);
    });

}

async function spin(winnerId) {
    if (spinning || PARTICIPANTS.length === 0) return;
    spinning = true;

    const winnerIdx = winnerId;

    buildSpinTrack(winnerIdx);
    const cw     = document.getElementById('spinnerBox').clientWidth || 900;
    const center = Math.floor(cw / 2) - ITEM_W / 2;
    const jitter = (Math.random() - .5) * (ITEM_W * .4);
    const finalX = -(WINNER_POS * ITEM_W - center + jitter);
    const track  = document.getElementById('track');
    track.style.transition = 'none';
    track.style.transform  = 'translateX(0px)';

    requestAnimationFrame(() => requestAnimationFrame(() => {
        track.style.transition = `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.12,0.82,0.35,1)`;
        track.style.transform  = `translateX(${finalX}px)`;

        startSpinSound(SPIN_DURATION_MS);

        setTimeout(() => {
            stopSpinSound();
            showWinner(PARTICIPANTS[winnerIdx]);
            spinning = false;
        }, SPIN_DURATION_MS + 80);
    }));
}

function showWinner(p) {
    document.getElementById('spinnerView').style.display = 'none';
    const avEl = document.getElementById('winnerAvatarBig');
    avEl.innerHTML        = '';
    avEl.style.background = '';
    if (p.avatar) {
        const img = document.createElement('img');
        img.src = p.avatar;
        img.alt = p.name;
        img.onerror = () => {
            img.remove();
            avEl.style.background = createRandomColor();
            avEl.textContent = p.name.slice(0, 2).toUpperCase();
        };
        avEl.appendChild(img);
    }
    else {
        avEl.style.background = createRandomColor();
        avEl.textContent = p.name.slice(0, 2).toUpperCase();
    }

    document.querySelector('.winner-label').textContent = tRD('winner.label');
    document.getElementById('winnerName').innerHTML = `<img src="js/modules/${p.platform}/images/logo-${p.platform}.svg" alt="${p.platform}" class="s-platform"> ${DOMPurify.sanitize(p.name)}`;
    document.getElementById('winnerView').classList.add('show');
    
    document.body.classList.add('winner');
    
    confetti({
        position: { x: (window.innerWidth  / 2), y: window.innerHeight  / 2 },
        count: 100,
        size: 1,
        velocity: 200,
        fade: false	
    });

    playTadaSound();
}

function resetRoll() {
    document.getElementById('winnerView').classList.remove('show');
    document.getElementById('spinnerView').style.display = '';
    populateTrack();
}

function createRandomColor() {
    const hue        = Math.random() * 360;
    const saturation = 100;
    const lightness  = 50;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function generateRoulette() {

    const lang = rouletteConfig.lang;
    loadLang(lang);
    
    if (rouletteConfig.test == true) {
        PARTICIPANTS = [
            { name: 'KingSlayer99', platform: 'twitch',   avatar: '' },
            { name: 'NightWolf',    platform: 'kick',     avatar: '' },
            { name: 'PixelQueen',   platform: 'youtube',  avatar: '' },
            { name: 'Stormborn',    platform: 'twitch',   avatar: '' },
            { name: 'ThunderFox',   platform: 'tiktok',   avatar: '' },
            { name: 'ShadowByte',   platform: 'twitch',   avatar: '' },
            { name: 'IronPulse',    platform: 'kick',     avatar: '' },
            { name: 'CrimsonAce',   platform: 'youtube',  avatar: '' },
            { name: 'VoidWalker',   platform: 'twitch',   avatar: '' },
            { name: 'NeonFang',     platform: 'twitch',   avatar: '' },
            { name: 'BlazePeak',    platform: 'kick',     avatar: '' },
            { name: 'FrostByte',    platform: 'youtube',  avatar: '' },
            { name: 'DarkMatter',   platform: 'twitch',   avatar: '' },
            { name: 'RiftBreaker',  platform: 'tiktok',   avatar: '' },
            { name: 'StarViper',    platform: 'twitch',   avatar: '' },
            { name: 'LunaStrike',   platform: 'kick',     avatar: '' },
            { name: 'ArcLight',     platform: 'youtube',  avatar: '' },
            { name: 'PhantomX',     platform: 'twitch',   avatar: '' },
        ];

        document.querySelector('.spinner-participants span').textContent = PARTICIPANTS.length;
    }

    SPIN_DURATION_MS    = parseInt(rouletteConfig.duration);
    SPIN_SPEED          = parseInt(rouletteConfig.speed);
    WINNER_POS          = 30 + Math.round(SPIN_SPEED) * 12;
    TOTAL               = WINNER_POS + 15;

    document.querySelector('.prize-label').textContent = rouletteConfig.label;
    document.querySelector('.prize-name').textContent  = rouletteConfig.prize;

    document.querySelector('#spinnerView').classList.add( rouletteConfig.position );

    const rouletteHandlers = {
        'General.Custom': (response) => {
            (async () => {
                await loadSettingsFromStreamerBot();

                if (response.data?.eventName == 'RouletteRD.Ready') {

                    if (PARTICIPANTS.length == 0) {
                        alert( tRD('general.no_participants') );
                        streamerBotClient.doAction({ name: "Reset RouletteRD" }, { }).then((res) => {
                            console.debug('[RouletteRD][Settings] Resetting Roulette...', res);
                        });
                        return;
                    }

                    if (document.body.classList.contains('winner') ) { return; }
                    
                    readyToSpin();
                }

                if (response.data?.eventName == 'RouletteRD.Spin') {
                    if (document.body.classList.contains('winner') ) { return; }
                    const winner = response.data.winner;
                    spin(winner);
                }

                if (response.data?.eventName == 'RouletteRD.Reset') {
                    location.reload();
                }
            })();
        }
    };

    registerPlatformHandlersToStreamerBot(rouletteHandlers, '[RouletteRD][Events]');

    populateTrack();
}