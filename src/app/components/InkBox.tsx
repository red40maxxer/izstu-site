'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './InkBox.module.css';

/* Hand-drawn hover highlight.
   Renders inside a positioned element and traces a box around it: the four
   sides ink on one after another, then the line keeps boiling while the
   pointer stays. Every stroke is generated here, so there is no image asset
   and it re-traces itself whenever the element is resized. */

const FRAMES = 3;      // separate traces of the same box, swapped to make it boil
const DRAW_MS = 460;   // total ink-on time
const BOIL_MS = 83;    // frame interval - a new drawing every 2 frames at 24fps
const ROUGH = 1;       // wobble amplitude
const OVERSHOOT = 6;   // how far each side runs past its corner
const STROKE = 2.6;
const MARGIN = 0;      // gap between the item's edge and the box
const INK = '#141210';

// side i draws over [delay, delay + duration]
const DELAYS = [0, 0.235, 0.47, 0.705].map((f) => f * DRAW_MS);
const SIDE_MS = 0.34 * DRAW_MS;
const FADE_MS = 170;

type Pt = [number, number];

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A few sines beats per-point randomness, which reads as noise rather than a
// drawn line.
function wobbler(rnd: () => number) {
  const p1 = rnd() * 6.283;
  const p2 = rnd() * 6.283;
  const p3 = rnd() * 6.283;
  return (a: number) =>
    Math.sin(a * 2.1 + p1) * 0.55 + Math.sin(a * 3.9 + p2) * 0.3 + Math.sin(a * 6.3 + p3) * 0.15;
}

function smooth(pts: Pt[]) {
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2;
    const my = (pts[i][1] + pts[i + 1][1]) / 2;
    d += `Q${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  return `${d}L${last[0].toFixed(1)} ${last[1].toFixed(1)}`;
}

// One trace of the box: four wobbling sides, each overshooting its corners.
function boxFrame(w: number, h: number, pad: number, seed: number): string[] {
  const rnd = mulberry32(seed);
  const wob = wobbler(rnd);
  const amp = ROUGH * 3.2;
  const steps = 18;
  // inset from the svg edge; the svg is padded by `pad`, so backing off by
  // MARGIN puts the box exactly that far outside the item
  const inset = pad - MARGIN;
  const corners: Pt[] = [
    [inset, inset],
    [w - inset, inset],
    [w - inset, h - inset],
    [inset, h - inset],
  ];

  return corners.map((A, s) => {
    const B = corners[(s + 1) % 4];
    const dx = B[0] - A[0];
    const dy = B[1] - A[1];
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const from = -OVERSHOOT / len;
    const to = 1 + OVERSHOOT / len;
    const pts: Pt[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = from + (to - from) * (i / steps);
      const n = wob(s * 2.7 + t * 3.4) * amp;
      // push the wobble perpendicular to the side
      pts.push([A[0] + dx * t - uy * n, A[1] + dy * t + ux * n]);
    }
    return smooth(pts);
  });
}

type Geom = { w: number; h: number; pad: number; frames: string[][] };

export default function InkBox() {
  const root = useRef<HTMLSpanElement>(null);
  const reduced = useRef(false);
  const [geom, setGeom] = useState<Geom | null>(null);
  const [on, setOn] = useState(false);
  const [fading, setFading] = useState(false);
  const [frame, setFrame] = useState(0);

  // Measure the element we sit inside, and trace the box around it.
  useEffect(() => {
    const host = root.current?.parentElement;
    if (!host) return;

    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const build = () => {
      const r = host.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const pad = MARGIN + OVERSHOOT + ROUGH * 4 + STROKE;
      const w = Math.round(r.width) + pad * 2;
      const h = Math.round(r.height) + pad * 2;
      setGeom({
        w,
        h,
        pad,
        frames: Array.from({ length: FRAMES }, (_, f) => boxFrame(w, h, pad, f * 811 + 17)),
      });
    };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  // Hover and keyboard focus both live on the parent, so the whole item is the
  // target rather than this overlay.
  useEffect(() => {
    const host = root.current?.parentElement;
    if (!host) return;

    let timer: number | undefined;
    const enter = () => {
      window.clearTimeout(timer);
      setFading(false);
      setOn(true);
    };
    const leave = () => {
      setFading(true);
      timer = window.setTimeout(
        () => {
          setOn(false);
          setFading(false);
        },
        reduced.current ? 0 : FADE_MS + 20,
      );
    };

    host.addEventListener('pointerenter', enter);
    host.addEventListener('pointerleave', leave);
    host.addEventListener('focusin', enter);
    host.addEventListener('focusout', leave);
    return () => {
      window.clearTimeout(timer);
      host.removeEventListener('pointerenter', enter);
      host.removeEventListener('pointerleave', leave);
      host.removeEventListener('focusin', enter);
      host.removeEventListener('focusout', leave);
    };
  }, []);

  // The boil only runs while the mark is showing.
  useEffect(() => {
    if (!on || reduced.current) return;
    const id = window.setInterval(() => setFrame((f) => (f + 1) % FRAMES), BOIL_MS);
    return () => window.clearInterval(id);
  }, [on]);

  const cls = [styles.root, on ? styles.on : '', fading ? styles.fading : ''].join(' ');
  const still = reduced.current;

  return (
    <span
      ref={root}
      className={cls}
      aria-hidden="true"
      style={
        {
          '--side-dur': `${still ? 1 : SIDE_MS}ms`,
          '--d1': `${still ? 0 : DELAYS[0]}ms`,
          '--d2': `${still ? 0 : DELAYS[1]}ms`,
          '--d3': `${still ? 0 : DELAYS[2]}ms`,
          '--d4': `${still ? 0 : DELAYS[3]}ms`,
          '--fade': `${still ? 0 : FADE_MS}ms`,
        } as React.CSSProperties
      }
    >
      {geom && (
        <svg
          className={styles.ink}
          viewBox={`0 0 ${geom.w} ${geom.h}`}
          width={geom.w}
          height={geom.h}
          style={{ left: -geom.pad, top: -geom.pad }}
        >
          {geom.frames[frame].map((d, i) => (
            <path key={i} d={d} pathLength="1" stroke={INK} strokeWidth={STROKE} />
          ))}
        </svg>
      )}
    </span>
  );
}
