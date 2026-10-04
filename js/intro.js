/* ==========================================================================
   Rosie & Joe — Wedding Site
   intro.js
   - Homepage entrance: the watercolour of Eyam Hall (with the names and
     date) is shown full-screen, then lifts away on a breeze as paper
     confetti, revealing the site beneath.
   - Plays once per browser session; add ?intro to the URL to replay it.
   - Skipped entirely under prefers-reduced-motion or without canvas.
   - Click, tap, scroll or any key hurries it along.
   - Include synchronously in <head> so the overlay is in place before the
     first paint; the markup it drives is <div class="intro"> in index.html.
   ========================================================================== */
(function () {
  "use strict";

  var IMAGE_SRC = "images/eyam-hall-watercolour.jpg";
  var STORAGE_KEY = "rj-intro-seen";

  var HOLD_MS = 2600; // how long the painting rests before dissolving
  var WAVE_MS = 1400; // time for the breeze to cross the painting
  var MAX_TILES = 1800; // cap on paper pieces, keeps phones smooth

  var PALETTE = ["#a94a68", "#d9829d", "#f6e8ec", "#6e7f52", "#b8c39f", "#fbf8f5"];

  var root = document.documentElement;

  function shouldPlay() {
    var forced = /[?&]intro\b/.test(window.location.search);
    var reduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !window.requestAnimationFrame) return false;
    if (!document.createElement("canvas").getContext) return false;
    if (forced) return true;
    try {
      if (window.sessionStorage.getItem(STORAGE_KEY)) return false;
    } catch (e) {
      /* storage blocked: play anyway */
    }
    return true;
  }

  if (!shouldPlay()) return;

  // Hide the page behind an ivory cover until the painting is ready.
  root.classList.add("intro-active", "intro-hold");

  try {
    window.sessionStorage.setItem(STORAGE_KEY, "1");
  } catch (e) {
    /* ignore */
  }

  // Load the image and fonts in parallel with the rest of the page.
  var img = new Image();
  var imgReady = new Promise(function (resolve, reject) {
    img.onload = resolve;
    img.onerror = reject;
  });
  img.src = IMAGE_SRC;

  var fontsReady = Promise.resolve();
  if (document.fonts && document.fonts.load) {
    fontsReady = Promise.race([
      Promise.all([
        document.fonts.load('300 italic 64px "Cormorant"'),
        document.fonts.load('300 20px "Jost"'),
      ]),
      new Promise(function (resolve) {
        setTimeout(resolve, 1500);
      }),
    ]).catch(function () {});
  }

  var domReady = new Promise(function (resolve) {
    if (document.readyState !== "loading") resolve();
    else document.addEventListener("DOMContentLoaded", resolve);
  });

  // Never trap a guest behind the cover if loading stalls or fails.
  var failsafe = setTimeout(finish, 6000);

  Promise.all([imgReady, fontsReady, domReady]).then(start, finish);

  /* ---- Helpers ---------------------------------------------------------- */
  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  // Sample the painting's paper colour so the margins around it are seamless.
  function paperColour() {
    try {
      var c = document.createElement("canvas");
      c.width = c.height = 1;
      var cx = c.getContext("2d");
      cx.drawImage(img, 4, 4, 1, 1, 0, 0, 1, 1);
      var d = cx.getImageData(0, 0, 1, 1).data;
      return "rgb(" + d[0] + "," + d[1] + "," + d[2] + ")";
    } catch (e) {
      return "#fbf8f5";
    }
  }

  /* ---- Paint the still: watercolour + names + date ---------------------- */
  function paintStill(w, h, dpr) {
    var src = document.createElement("canvas");
    src.width = Math.round(w * dpr);
    src.height = Math.round(h * dpr);
    var g = src.getContext("2d");
    g.scale(dpr, dpr);

    g.fillStyle = paperColour();
    g.fillRect(0, 0, w, h);

    // Cover on landscape screens; on tall phones keep most of the house in
    // view and let the paper colour fill above and below.
    var iw = img.naturalWidth;
    var ih = img.naturalHeight;
    var scale = Math.min(Math.max(w / iw, h / ih), (w * 1.8) / iw);
    var dw = iw * scale;
    var dh = ih * scale;
    var dx = (w - dw) / 2;
    var dy = (h - dh) / 2 + (h > w ? h * 0.06 : 0);
    g.drawImage(img, dx, dy, dw, dh);

    // Names sit in the painting's open sky.
    var namesSize = Math.min(dw * 0.072, h * 0.12, 112);
    var namesY = Math.max(dy + dh * 0.17, namesSize * 1.1);
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillStyle = "#221e1b";
    g.font = "300 italic " + namesSize + 'px "Cormorant", Georgia, serif';
    g.fillText("Rosie & Joe", w / 2, namesY);

    var dateSize = Math.max(11, namesSize * 0.2);
    g.fillStyle = "#a94a68";
    g.font = "300 " + dateSize + 'px "Jost", system-ui, sans-serif';
    if ("letterSpacing" in g) g.letterSpacing = dateSize * 0.22 + "px";
    g.fillText("SATURDAY 17 APRIL 2027", w / 2, namesY + namesSize * 0.72);

    return src;
  }

  /* ---- Build the paper pieces ------------------------------------------- */
  function makeTiles(w, h) {
    var cell = Math.max(8, Math.ceil(Math.sqrt((w * h) / MAX_TILES)));
    var cols = Math.ceil(w / cell);
    var rows = Math.ceil(h / cell);
    var tiles = [];
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var x = c * cell;
        var y = r * cell;
        // A soft diagonal breeze from the lower left, with a ragged edge.
        var front = (x / w) * 0.72 + (1 - y / h) * 0.28;
        tiles.push({
          sx: x,
          sy: y,
          size: cell,
          delay: (front * 0.7 + Math.random() * 0.3) * WAVE_MS,
          x: x + cell / 2,
          y: y + cell / 2,
          vx: rand(0.05, 0.28), // px per ms
          vy: rand(-0.32, -0.08),
          rot: 0,
          spin: rand(-0.006, 0.006), // rad per ms
          flip: 0, // starts flat, then turns over as it lifts
          flipSpeed: rand(0.006, 0.014),
          sway: rand(0, Math.PI * 2),
          life: rand(1500, 2300),
        });
      }
    }
    return { tiles: tiles, cell: cell };
  }

  function makeConfetti(w, h, cell) {
    var count = Math.round(Math.min(220, (w * h) / 5000));
    var bits = [];
    for (var i = 0; i < count; i++) {
      var y = rand(0, h);
      var x = rand(0, w);
      var front = (x / w) * 0.72 + (1 - y / h) * 0.28;
      bits.push({
        petal: Math.random() < 0.45,
        colour: PALETTE[i % PALETTE.length],
        w: rand(0.5, 0.9) * cell,
        h: rand(0.28, 0.5) * cell,
        delay: front * WAVE_MS * 0.9 + rand(0, 300),
        x: x,
        y: y,
        vx: rand(0.08, 0.32),
        vy: rand(-0.36, -0.1),
        rot: rand(0, Math.PI * 2),
        spin: rand(-0.008, 0.008),
        flip: rand(0, Math.PI * 2),
        flipSpeed: rand(0.008, 0.018),
        sway: rand(0, Math.PI * 2),
        life: rand(1900, 2700),
      });
    }
    return bits;
  }

  // Shared motion: peel away slowly, lift on the breeze, sway, drift down.
  function step(p, dt, age) {
    var ease = Math.min(1, age / 700);
    ease *= ease;
    p.vy += 0.00022 * dt; // gentle gravity
    p.vx *= 1 - 0.0004 * dt; // air drag
    p.sway += 0.004 * dt;
    p.x += (p.vx + Math.sin(p.sway) * 0.05) * ease * dt;
    p.y += p.vy * ease * dt;
    p.rot += p.spin * ease * dt;
    p.flip += p.flipSpeed * ease * dt;
  }

  /* ---- Run -------------------------------------------------------------- */
  var overlay, canvas, ctx, stopped = false, hurry = false;

  function start() {
    overlay = document.querySelector(".intro");
    canvas = overlay && overlay.querySelector("canvas");
    ctx = canvas && canvas.getContext("2d");
    if (!ctx) return finish();
    clearTimeout(failsafe);
    failsafe = setTimeout(finish, HOLD_MS + 8000);

    var w = window.innerWidth;
    var h = window.innerHeight;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    var still = paintStill(w, h, dpr);
    var built = makeTiles(w, h);
    var tiles = built.tiles;
    var confetti = makeConfetti(w, h, built.cell);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.drawImage(still, 0, 0, w, h);
    overlay.classList.add("is-shown");

    ["pointerdown", "keydown", "wheel", "touchmove"].forEach(function (type) {
      window.addEventListener(type, onHurry, { passive: true });
    });

    var shownAt = performance.now();
    var dissolveAt = null;
    var last = shownAt;
    var clock = 0; // dissolve time, which runs faster once hurried

    function frame(now) {
      if (stopped) return;
      var dt = Math.min(now - last, 50);
      last = now;

      if (dissolveAt === null) {
        if (!hurry && now - shownAt < HOLD_MS) {
          requestAnimationFrame(frame);
          return;
        }
        dissolveAt = now;
        // The canvas is now fully painted; let the page show through gaps.
        overlay.classList.add("is-dissolving");
        root.classList.remove("intro-hold");
      }

      var speed = hurry ? 2.6 : 1;
      dt *= speed;
      clock += dt;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      var alive = 0;
      for (var i = 0; i < tiles.length; i++) {
        var t = tiles[i];
        var age = clock - t.delay;
        var sx = t.sx * dpr;
        var sy = t.sy * dpr;
        var ss = t.size * dpr;

        if (age <= 0) {
          alive++;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.globalAlpha = 1;
          ctx.drawImage(still, sx, sy, ss, ss, t.sx, t.sy, t.size, t.size);
          continue;
        }
        if (age >= t.life) continue;
        alive++;
        step(t, Math.min(dt, age), age);

        var k = age / t.life;
        var shrink = 1 - k * k * 0.6;
        var cos = Math.cos(t.rot);
        var sin = Math.sin(t.rot);
        var fx = Math.cos(t.flip) * shrink; // paper turning over in the air
        ctx.setTransform(
          cos * fx * dpr,
          sin * fx * dpr,
          -sin * shrink * dpr,
          cos * shrink * dpr,
          t.x * dpr,
          t.y * dpr
        );
        ctx.globalAlpha = 1 - k * k;
        var half = t.size / 2;
        ctx.drawImage(still, sx, sy, ss, ss, -half, -half, t.size, t.size);
      }

      for (var j = 0; j < confetti.length; j++) {
        var b = confetti[j];
        var bitAge = clock - b.delay;
        if (bitAge <= 0) {
          alive++;
          continue;
        }
        if (bitAge >= b.life) continue;
        alive++;
        step(b, Math.min(dt, bitAge), bitAge);
        var bk = bitAge / b.life;
        var bc = Math.cos(b.rot);
        var bs = Math.sin(b.rot);
        var bf = Math.cos(b.flip);
        ctx.setTransform(bc * dpr, bs * dpr, -bs * bf * dpr, bc * bf * dpr, b.x * dpr, b.y * dpr);
        // Fade in as they appear, then out as they settle.
        ctx.globalAlpha = Math.min(1, bitAge / 200) * (1 - bk * bk);
        ctx.fillStyle = b.colour;
        ctx.beginPath();
        if (b.petal) {
          ctx.ellipse(0, 0, b.w / 2, b.h / 2, 0, 0, Math.PI * 2);
        } else {
          ctx.rect(-b.w / 2, -b.h / 2, b.w, b.h);
        }
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      if (alive === 0) return finish();
      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  function onHurry() {
    hurry = true;
  }

  function finish() {
    if (stopped) return;
    stopped = true;
    clearTimeout(failsafe);
    ["pointerdown", "keydown", "wheel", "touchmove"].forEach(function (type) {
      window.removeEventListener(type, onHurry);
    });
    root.classList.remove("intro-active", "intro-hold");
    var el = document.querySelector(".intro");
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }
})();
