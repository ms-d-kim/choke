"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEF0123456789!<>-_\\/[]{}=+*^?#:.";

type Cell = { ch: string; done: boolean };

// Decode / scramble effect — random glyphs resolve into the target text.
export function Scramble({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [cells, setCells] = useState<Cell[]>(() =>
    text.split("").map((ch) => ({ ch, done: true })),
  );
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const target = text.split("");
    // resolve time per char, in ms — time-based so it completes in wall-clock
    // time regardless of frame rate (rAF throttling won't leave it stuck).
    const ends = target.map((ch) => (ch === " " ? 0 : 140 + Math.random() * 460));
    const cur = target.map(() => "");
    const start = performance.now();
    const tick = () => {
      const t = performance.now() - start;
      let done = 0;
      const next: Cell[] = target.map((ch, i) => {
        if (ch === " ") {
          done++;
          return { ch: " ", done: true };
        }
        if (t >= ends[i]) {
          done++;
          return { ch, done: true };
        }
        if (!cur[i] || Math.random() < 0.4) {
          cur[i] = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        return { ch: cur[i], done: false };
      });
      setCells(next);
      if (done === target.length) {
        raf.current = null;
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [text]);

  return (
    <span className={className} aria-label={text}>
      {cells.map((c, i) => (
        <span key={i} aria-hidden className={c.done ? undefined : "text-foreground/30"}>
          {c.ch}
        </span>
      ))}
    </span>
  );
}

// Typewriter — reveals the text left-to-right at a steady chars/sec, with a cursor.
export function Typewriter({
  text,
  className,
  cps = 110,
}: {
  text: string;
  className?: string;
  cps?: number;
}) {
  const [n, setN] = useState(text.length);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const shown = Math.floor(((ts - start) / 1000) * cps);
      setN(Math.min(text.length, shown));
      raf.current = shown < text.length ? requestAnimationFrame(step) : null;
    };
    setN(0);
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [text, cps]);

  return (
    <span className={className} aria-label={text}>
      {text.slice(0, n)}
      {n < text.length && (
        <span className="text-amber" aria-hidden>
          ▋
        </span>
      )}
    </span>
  );
}
