"use client";

import { useEffect, useRef } from "react";

import { gsap } from "./motion/gsap";

/**
 * The lattice behind the closing two sections.
 *
 * A grid of hairlines and nodes that warps toward the pointer. It sits in Ready
 * and in the footer, behind their content, and it is the section's texture in
 * the same way the diagonal stripe is a Works card's texture.
 *
 * WHAT IT REPLACED. Ready used to carry `<GlyphField />`, a masked field of mono
 * characters. That component, its content and its `.jn-glyphs` rules are all
 * still in the tree, unused, following the precedent set by Skills and Outside.
 * Two decorative layers behind one headline is one too many, so this took the
 * slot rather than stacking on it.
 *
 * ADAPTED FROM A SUPPLIED COMPONENT, and the changes are not cosmetic. What
 * survived is the interesting part: the bell-falloff warp, the edge pin that
 * keeps the boundary rows from tearing away from the panel edge, the smoothstep
 * blend on line and node colour, and the pointer easing. What changed, and why:
 *
 *   - `position: fixed` became `absolute`. A fixed full-viewport canvas is wrong
 *     twice over here. Two instances would each paint the whole screen over each
 *     other, and the panel stack paints OPAQUE grounds over a sticky hero, so a
 *     fixed layer behind them is invisible for most of the page.
 *
 *   - NO CLICK RIPPLES, and that is the decision that makes this shippable at
 *     all. A ripple has to receive the click, so the canvas would need
 *     `pointer-events: auto`, and a full-bleed interactive layer then becomes
 *     `e.target` for every pointer event on the page. `cursor.tsx` resolves its
 *     state with `closest("[data-cursor]")` from that target, so every control
 *     would silently drop to the default cursor, and every card and link
 *     underneath would stop being clickable. `pointer-events: none` stays.
 *
 *   - IT DRAWS NO BACKGROUND. The original filled its own `#161618`. The section
 *     already paints `--color-ink-bg` via `.jn-panel--void`, so filling here
 *     would put a second, slightly different black on the page. Clearing and
 *     letting the panel show through means the grid can never disagree with its
 *     own ground.
 *
 *   - COLOURS COME FROM THE TOKENS, read once from computed style. The active
 *     colour is `--color-accent-tint` and must stay that: `--color-accent` is
 *     3.24:1 on void and the token block says outright that it cannot be read on
 *     a dark ground.
 *
 *   - IT RUNS ON `gsap.ticker`, not its own `requestAnimationFrame`. Lenis is
 *     deliberately driven from the ticker so that scroll reads and writes happen
 *     once per frame in a known order; see `motion/smooth-scroll.tsx`. A second
 *     uncoordinated loop would sample the scroll position at an arbitrary point
 *     relative to Lenis writing it. The ticker hands out seconds, which is why
 *     the Lenis bridge multiplies by 1000 — this loop needs no clock at all, so
 *     it ignores the argument entirely.
 *
 *   - IT SCALES FOR `devicePixelRatio`. The original sized the canvas in CSS
 *     pixels, which is the one thing a drawing made entirely of 1px lines cannot
 *     survive: every hairline would be soft on any retina display.
 *
 *   - THE STATIC DOT TEXTURE IS GONE. Every other section on the page now has a
 *     dotted ground, and these two are the ones that have this instead.
 *
 * ONE STATIC FRAME IS PAINTED SYNCHRONOUSLY ON MOUNT, before any loop starts.
 * That is what gives the reduced-motion and touch fallbacks for free: with no
 * pointer the warp is identically zero, so the resting state is a plain lattice
 * and there is nothing to degrade. It is also the only reason any of this can be
 * checked in a headless or hidden browser, which fires no animation frames.
 */

/** Nominal pitch. The real spacing is derived so the lattice lands exactly on
    both edges, so this is a target rather than a measurement. */
const CELL_SIZE = 55;

/** How far the pointer's influence reaches, in CSS pixels. */
const INFLUENCE_RADIUS = 260;

/** Peak displacement at the centre of that influence. */
const MAX_WARP = 24;

/** Pointer easing per frame. Small, so the lattice trails the cursor. */
const LERP_SPEED = 0.08;

const NODE_BASE_RADIUS = 1.8;
const NODE_ACTIVE_RADIUS = 3.2;

/** Parked far enough off-canvas that no node is ever within influence, which is
    what makes "no pointer" and "resting lattice" the same state. */
const AWAY = -9999;

type Point = { x: number; y: number };
type Rgb = { r: number; g: number; b: number };

/** The motion gate, identical to the one `cursor.tsx` uses. A pointer warp has
    no meaning on a device with no pointer, and someone who asked for less motion
    should get the resting lattice. */
const MOTION_OK =
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/** Fallbacks matching `--color-ink-fg` and `--color-accent-tint`. Used only if a
    token cannot be read, which should never happen but must not blank the
    canvas if it does. */
const IDLE_FALLBACK: Rgb = { r: 242, g: 242, b: 245 };
const LIVE_FALLBACK: Rgb = { r: 143, g: 178, b: 255 };

function hexToRgb(raw: string, fallback: Rgb): Rgb {
  const hex = raw.trim().replace("#", "");
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  if (full.length !== 6 || !/^[0-9a-f]{6}$/i.test(full)) return fallback;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function rgba(c: Rgb, a: number) {
  return `rgba(${c.r},${c.g},${c.b},${a})`;
}

function mixed(a: Rgb, b: Rgb, t: number, alpha: number) {
  return `rgba(${Math.round(lerp(a.r, b.r, t))},${Math.round(
    lerp(a.g, b.g, t),
  )},${Math.round(lerp(a.b, b.b, t))},${alpha.toFixed(3)})`;
}

/** Smoothstep. Takes the linear proximity to something with shoulders, so the
    colour change reads as a pool of light rather than a cone. */
function ease(t: number) {
  return t * t * (3 - 2 * t);
}

export function KineticGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* Read once. These are `@theme` tokens, so they are static for the life of
       the page; re-reading them every frame would be a layout read per frame for
       a value that cannot change. */
    const styles = getComputedStyle(canvas);
    const idle = hexToRgb(
      styles.getPropertyValue("--color-ink-fg"),
      IDLE_FALLBACK,
    );
    const live = hexToRgb(
      styles.getPropertyValue("--color-accent-tint"),
      LIVE_FALLBACK,
    );

    /* Size in CSS pixels. The backing store is this times the device ratio. */
    let w = 0;
    let h = 0;

    /* Pointer state in CLIENT coordinates, eased there rather than in canvas
       space. The distinction matters: easing in canvas space would make the warp
       lag behind scrolling as well as behind the cursor, because the canvas
       moves under a stationary pointer. Easing the client point and converting
       it with a fresh rect each frame means scroll is exact and only the cursor
       has weight. */
    const target: Point = { x: AWAY, y: AWAY };
    const eased: Point = { x: AWAY, y: AWAY };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      /* Cap the ratio. A 3x or 4x display would triple or quadruple the pixel
         count for a drawing of hairlines that gains nothing past 2x. */
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      /* One transform, so everything below is written in CSS pixels. */
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      if (w === 0 || h === 0) return;

      /* Fresh each frame, so the pointer maps correctly however the panel has
         moved: scroll, the panel stack's own transform, a resize. */
      const rect = canvas.getBoundingClientRect();
      const mx = eased.x === AWAY ? AWAY : eased.x - rect.left;
      const my = eased.y === AWAY ? AWAY : eased.y - rect.top;

      ctx.clearRect(0, 0, w, h);

      const cols = Math.max(2, Math.ceil(w / CELL_SIZE)) + 1;
      const rows = Math.max(2, Math.ceil(h / CELL_SIZE)) + 1;
      const cellW = w / (cols - 1);
      const cellH = h / (rows - 1);

      /* Flat arrays rather than the nested ones the original allocated. Three
         numbers per node, one allocation per resize instead of two arrays of
         arrays per frame. */
      const total = cols * rows;
      const px = new Float32Array(total);
      const py = new Float32Array(total);
      const pr = new Float32Array(total);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const i = row * cols + col;
          const gx = col * cellW;
          const gy = row * cellH;

          /* THE EDGE PIN. Boundary rows and columns are held in place, easing
             in over one and a half cells. Without it the lattice peels away
             from the panel edge and the section grows a visible margin of
             nothing whenever the pointer is near a border. */
          const margin = 1.5;
          const colPin = Math.min(col / margin, (cols - 1 - col) / margin, 1);
          const rowPin = Math.min(row / margin, (rows - 1 - row) / margin, 1);
          const pin = colPin * colPin * rowPin * rowPin;

          const dx = gx - mx;
          const dy = gy - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          pr[i] = Math.max(0, 1 - dist / INFLUENCE_RADIUS) * pin;

          if (dist < INFLUENCE_RADIUS && dist > 0 && pin > 0) {
            /* A bell, not a cone. The final `min(1, dist/60)` is what keeps the
               node directly under the pointer from being yanked: without it the
               displacement peaks exactly where the falloff is steepest and the
               centre of the field snaps. */
            const t = dist / INFLUENCE_RADIUS;
            const bell = t < 0.01 ? 0 : (1 - t) * (1 - t) * Math.min(1, dist / 60);
            const amt = bell * MAX_WARP * pin;
            const a = Math.atan2(dy, dx);
            px[i] = gx - Math.cos(a) * amt;
            py[i] = gy - Math.sin(a) * amt;
          } else {
            px[i] = gx;
            py[i] = gy;
          }
        }
      }

      /* ---- Lines ---------------------------------------------------------
         Two passes, and the split is a real saving rather than tidiness. Every
         segment with no proximity at either end shares one colour and one
         width, so they all go into a SINGLE path and cost one `stroke()`
         between them. Only the handful near the pointer need their own. At rest
         that is one stroke call for the whole lattice instead of about eleven
         hundred. */
      const base = new Path2D();
      const hot: { p: Path2D; t: number }[] = [];

      const seg = (a: number, b: number) => {
        const t = (pr[a] + pr[b]) / 2;
        if (t <= 0.001) {
          base.moveTo(px[a], py[a]);
          base.lineTo(px[b], py[b]);
          return;
        }
        const p = new Path2D();
        p.moveTo(px[a], py[a]);
        p.lineTo(px[b], py[b]);
        hot.push({ p, t: ease(t) });
      };

      for (let row = 0; row < rows; row++)
        for (let col = 0; col < cols - 1; col++)
          seg(row * cols + col, row * cols + col + 1);

      for (let col = 0; col < cols; col++)
        for (let row = 0; row < rows - 1; row++)
          seg(row * cols + col, (row + 1) * cols + col);

      ctx.lineCap = "butt";
      ctx.strokeStyle = rgba(idle, 0.13);
      ctx.lineWidth = 0.8;
      ctx.stroke(base);

      for (const { p, t } of hot) {
        ctx.strokeStyle = mixed(idle, live, t, lerp(0.13, 0.9, t));
        ctx.lineWidth = lerp(0.8, 1.5, t);
        ctx.stroke(p);
      }

      /* ---- Nodes ---------------------------------------------------------
         Same trick. Resting nodes are one path and one `fill()`; a node's arc is
         a subpath, so hundreds of them batch cleanly. */
      const dots = new Path2D();
      for (let i = 0; i < total; i++) {
        if (pr[i] > 0.001) continue;
        dots.moveTo(px[i] + NODE_BASE_RADIUS, py[i]);
        dots.arc(px[i], py[i], NODE_BASE_RADIUS, 0, Math.PI * 2);
      }
      ctx.fillStyle = rgba(idle, 0.2);
      ctx.fill(dots);

      for (let i = 0; i < total; i++) {
        if (pr[i] <= 0.001) continue;
        const t = ease(pr[i]);
        const r = lerp(NODE_BASE_RADIUS, NODE_ACTIVE_RADIUS, t);

        if (t > 0.3) {
          const glowR = r + lerp(0, 6, (t - 0.3) / 0.7);
          const g = ctx.createRadialGradient(
            px[i],
            py[i],
            r * 0.5,
            px[i],
            py[i],
            glowR,
          );
          g.addColorStop(0, rgba(live, Number((t * 0.3).toFixed(3))));
          g.addColorStop(1, rgba(live, 0));
          ctx.beginPath();
          ctx.arc(px[i], py[i], glowR, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(px[i], py[i], r, 0, Math.PI * 2);
        ctx.fillStyle = mixed(idle, live, t, lerp(0.2, 1, t));
        ctx.fill();
      }
    };

    const tick = () => {
      eased.x = lerp(eased.x, target.x, LERP_SPEED);
      eased.y = lerp(eased.y, target.y, LERP_SPEED);
      draw();
    };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    /* ---- Sizing --------------------------------------------------------
       A ResizeObserver on the canvas rather than a window resize listener,
       because the panel's height is content-driven: it changes on a font load
       or a reflow with no window event at all. */
    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });

    /* THE STATIC FRAME, painted here and before anything else can start. With
       no pointer yet, every proximity is zero and this is the resting lattice —
       which is also, unchanged, what a reduced-motion or touch visitor gets. */
    resize();
    draw();
    ro.observe(canvas);

    /* ---- The loop, and when it is allowed to run -----------------------
       Two gates, both of which must be open. The media query is the
       preference; the observer is the plain fact that these are the last two
       sections on the page, so an always-on loop would repaint for the entire
       scroll before either one is visible. */
    let running = false;
    let visible = false;
    const mq = window.matchMedia(MOTION_OK);

    const stop = () => {
      if (!running) return;
      running = false;
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", onMove);
      /* Ease back to rest rather than freezing mid-warp: park the pointer and
         paint once. A lattice abandoned halfway through a warp reads as a
         rendering fault. */
      target.x = AWAY;
      target.y = AWAY;
      eased.x = AWAY;
      eased.y = AWAY;
      draw();
    };

    const sync = () => {
      const want = visible && mq.matches;
      if (want === running) return;
      if (!want) {
        stop();
        return;
      }
      running = true;
      window.addEventListener("pointermove", onMove, { passive: true });
      gsap.ticker.add(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
        sync();
      },
      /* A margin, so the lattice is already alive by the time the panel's top
         edge arrives rather than starting from rest in view. */
      { rootMargin: "200px" },
    );
    io.observe(canvas);

    mq.addEventListener("change", sync);

    return () => {
      io.disconnect();
      ro.disconnect();
      mq.removeEventListener("change", sync);
      /* Order matters: `stop()` both removes the ticker callback and paints, and
         painting into a canvas that is about to be discarded is harmless, while
         leaving a callback on the ticker is not. */
      stop();
    };
  }, []);

  /* `aria-hidden` and out of the pointer's way, the same as `.jn-glyphs` before
     it. There is nothing here for a reader, and nothing to click. */
  return <canvas ref={canvasRef} className="jn-grid" aria-hidden="true" />;
}
