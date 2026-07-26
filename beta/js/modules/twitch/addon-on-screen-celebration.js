/* Thank you Claude <3 */

/**
 * onScreenCelebration
 * -----------------------------------------------------------------------
 * Recria o Power-up "On-Screen Celebration" da Twitch: várias cópias de um
 * emote sobem pela tela como balões de hélio, balançando em zigue-zague,
 * com variação de tamanho, velocidade e opacidade.
 *
 * Uso básico:
 *   onScreenCelebration("https://static-cdn.jtvnw.net/emoticons/.../3.0");
 *
 * Uso com parâmetros customizados:
 *   onScreenCelebration(emoteUrl, {
 *     minSize: 24,
 *     maxSize: 70,
 *     spawnDuration: 8000,
 *     spawnInterval: 90,
 *     direction: "down"
 *   });
 *
 * Retorna um objeto controlador: { stop() } — chame .stop() para
 * interromper novos spawns e deixar as cópias já em tela terminarem.
 * -----------------------------------------------------------------------
 */

function onScreenCelebration(emoteUrl, options = {}) {
  const {
    // tamanho de cada emote (px), sorteado entre minSize e maxSize
    minSize = 18,
    maxSize = 56,

    // velocidade vertical (px/frame), sorteada entre minSpeed e maxSpeed
    minSpeed = 0.45,
    maxSpeed = 1.1,

    // amplitude horizontal do zigue-zague (px)
    minAmplitude = 25,
    maxAmplitude = 90,

    // frequência do zigue-zague (quanto maior, mais rápido ele balança)
    minFrequency = 0.006,
    maxFrequency = 0.016,

    // rotação leve de cada emote (radianos) e sua velocidade de giro
    minRotation = -0.3,
    maxRotation = 0.3,
    minRotationSpeed = -0.01,
    maxRotationSpeed = 0.01,

    // opacidade máxima de cada emote
    minOpacity = 0.75,
    maxOpacity = 1,

    // duração do fade-in ao nascer (ms)
    minFadeIn = 300,
    maxFadeIn = 600,

    // tempo de vida de cada emote antes de ser removido (ms)
    minLife = 6500,
    maxLife = 10000,

    // por quanto tempo novos emotes continuam nascendo (ms)
    spawnDuration = 5000,

    // intervalo entre cada novo emote nascendo (ms) — controla o espaçamento
    spawnInterval = 130,

    // quantos emotes nascem por "tick" do intervalo acima
    spawnCount = 1,

    // "up" = sobe como balão de hélio | "down" = cai como confete
    direction = "up",

    // zona de fade-out perto da borda de saída (px)
    edgeFadeZone = 140,

    // elemento canvas já existente para reaproveitar (opcional).
    // Se não for passado, um canvas full-screen é criado e removido
    // automaticamente ao final da animação.
    canvas = null,

    // callback disparado quando a animação termina naturalmente
    onComplete = null
  } = options;

  if (!emoteUrl) {
    throw new Error("onScreenCelebration: 'emoteUrl' é obrigatório.");
  }

  const rand = (min, max) => Math.random() * (max - min) + min;

  // ---- canvas: usa o fornecido ou cria um overlay full-screen próprio ----
  let ownCanvas = false;
  let cvs = canvas;
  if (!cvs) {
    ownCanvas = true;
    cvs = document.createElement("canvas");
    cvs.style.position = "fixed";
    cvs.style.inset = "0";
    cvs.style.width = "100%";
    cvs.style.height = "100%";
    cvs.style.pointerEvents = "none";
    cvs.style.zIndex = "2147483647";
    //document.body.appendChild(cvs);
    document.getElementById("chat").appendChild(cvs);
  }
  const ctx = cvs.getContext("2d");

  function resize() {
    const w = cvs.clientWidth || window.innerWidth;
    const h = cvs.clientHeight || window.innerHeight;
    cvs.width = w * devicePixelRatio;
    cvs.height = h * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  // ---- carrega o emote ----
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = emoteUrl;

  let emotes = [];
  let rafId = null;
  let spawning = false;
  let stopped = false;

  function spawnEmote() {
    const size = rand(minSize, maxSize);
    const w = cvs.clientWidth || window.innerWidth;
    const h = cvs.clientHeight || window.innerHeight;
    const goingUp = direction === "up";

    emotes.push({
      baseX: rand(0, w),
      y: goingUp ? h + size : -size,
      size,
      vy: goingUp ? -rand(minSpeed, maxSpeed) : rand(minSpeed, maxSpeed),
      amp: rand(minAmplitude, maxAmplitude),
      freq: rand(minFrequency, maxFrequency),
      phase: rand(0, Math.PI * 2),
      rot: rand(minRotation, maxRotation),
      vrot: rand(minRotationSpeed, maxRotationSpeed),
      born: performance.now(),
      fadeIn: rand(minFadeIn, maxFadeIn),
      life: rand(minLife, maxLife),
      opacityMax: rand(minOpacity, maxOpacity)
    });
  }

  function tick(now) {
    const w = cvs.clientWidth || window.innerWidth;
    const h = cvs.clientHeight || window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    const goingUp = direction === "up";

    emotes.forEach((e) => {
      e.y += e.vy;
      e.rot += e.vrot;
      const age = now - e.born;
      const x = e.baseX + Math.sin(e.y * e.freq + e.phase) * e.amp;

      let alpha;
      if (age < e.fadeIn) {
        alpha = (age / e.fadeIn) * e.opacityMax;
      } else if (goingUp && e.y < edgeFadeZone) {
        alpha = e.opacityMax * Math.max(0, e.y / edgeFadeZone);
      } else if (!goingUp && e.y > h - edgeFadeZone) {
        alpha = e.opacityMax * Math.max(0, (h - e.y) / edgeFadeZone);
      } else {
        alpha = e.opacityMax;
      }

      if (alpha <= 0) return;

      ctx.save();
      ctx.globalAlpha = Math.min(1, Math.max(0, alpha));
      ctx.translate(x, e.y);
      ctx.rotate(e.rot);
      ctx.drawImage(img, -e.size / 2, -e.size / 2, e.size, e.size);
      ctx.restore();
    });

    emotes = emotes.filter((e) => {
      const alive = (now - e.born) < e.life;
      const onScreen = goingUp ? (e.y + e.size > -20) : (e.y - e.size < h + 20);
      return alive && onScreen;
    });

    if (spawning || emotes.length) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
      cleanup();
    }
  }

  function ensureLoop() {
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function cleanup() {
    window.removeEventListener("resize", resize);
    if (ownCanvas && cvs.parentNode) {
      cvs.parentNode.removeChild(cvs);
    }
    if (typeof onComplete === "function") onComplete();
  }

  function start() {
    spawning = true;
    ensureLoop();

    const spawnStart = performance.now();
    const spawnTimer = setInterval(() => {
      if (stopped || performance.now() - spawnStart > spawnDuration) {
        clearInterval(spawnTimer);
        spawning = false;
        return;
      }
      for (let i = 0; i < spawnCount; i++) spawnEmote();
    }, spawnInterval);
  }

  if (img.complete) {
    start();
  } else {
    img.onload = start;
    img.onerror = () => {
      throw new Error(`onScreenCelebration: falha ao carregar o emote em "${emoteUrl}".`);
    };
  }

  // controlador: permite interromper novos spawns manualmente
  return {
    stop() {
      stopped = true;
      spawning = false;
    }
  };
}

// Disponibiliza no escopo global quando usado via <script src="...">
if (typeof window !== "undefined") {
  window.onScreenCelebration = onScreenCelebration;
}

// Suporte a import/export em módulos ES / CommonJS, caso aplicável
if (typeof module !== "undefined" && module.exports) {
  module.exports = onScreenCelebration;
}